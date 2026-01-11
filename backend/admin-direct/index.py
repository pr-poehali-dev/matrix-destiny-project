import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta
from urllib.parse import parse_qs

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Прямая админка через GET параметры (без CORS preflight)
    """
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
    }
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': '', 'isBase64Encoded': False}
    
    try:
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'list')
        
        if action == 'list':
            cur.execute(f"""
                SELECT pr.id, pr.email, pr.phone, pr.screenshot_url, pr.status, pr.created_at, pr.plan_type, pr.amount,
                       aa.plan_type, aa.expires_at, aa.downloads_left
                FROM {schema}.payment_requests pr
                LEFT JOIN {schema}.active_access aa ON pr.email = aa.email
                ORDER BY pr.created_at DESC
            """)
            rows = cur.fetchall()
            
            result = []
            for r in rows:
                access_info = None
                if r[8]:  # has active_access
                    access_info = {
                        'plan_type': r[8],
                        'expires_at': r[9].isoformat() if r[9] else None,
                        'downloads_left': r[10]
                    }
                
                result.append({
                    'id': r[0],
                    'email': r[1],
                    'phone': r[2] or '',
                    'screenshot_url': r[3] or '',
                    'status': r[4],
                    'created_at': r[5].isoformat() if r[5] else '',
                    'plan_type': r[6],
                    'amount': r[7],
                    'access_info': access_info
                })
            
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result), 'isBase64Encoded': False}
        
        elif action == 'grant':
            email = params.get('email')
            plan = params.get('plan_type', 'month')
            
            if not email:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Email required'}), 'isBase64Encoded': False}
            
            exp = None
            dl = None
            
            if plan == 'single':
                dl = 1
            elif plan == 'month':
                exp = datetime.now() + timedelta(days=30)
            elif plan == 'half_year':
                exp = datetime.now() + timedelta(days=180)
            elif plan == 'year':
                exp = datetime.now() + timedelta(days=365)
            
            cur.execute(f"SELECT plan_type, downloads_left FROM {schema}.active_access WHERE email = %s", (email,))
            existing = cur.fetchone()
            
            if existing and plan == 'single':
                existing_downloads = existing[1] or 0
                new_downloads = existing_downloads + 1
                cur.execute(f"""
                    UPDATE {schema}.active_access 
                    SET downloads_left = %s, granted_at = CURRENT_TIMESTAMP
                    WHERE email = %s
                """, (new_downloads, email))
            elif existing:
                cur.execute(f"""
                    UPDATE {schema}.active_access 
                    SET plan_type = %s, expires_at = %s, downloads_left = %s, granted_at = CURRENT_TIMESTAMP
                    WHERE email = %s
                """, (plan, exp, dl, email))
            else:
                cur.execute(f"""
                    INSERT INTO {schema}.active_access (email, plan_type, expires_at, downloads_left, granted_by)
                    VALUES (%s, %s, %s, %s, 'admin')
                """, (email, plan, exp, dl))
            
            conn.commit()
            
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True}), 'isBase64Encoded': False}
        
        elif action == 'approve':
            rid = int(params.get('id', 0))
            email = params.get('email')
            
            if not rid or not email:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'ID and email required'}), 'isBase64Encoded': False}
            
            cur.execute(f"SELECT plan_type FROM {schema}.payment_requests WHERE id = %s", (rid,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Request not found'}), 'isBase64Encoded': False}
            
            plan = row[0]
            
            exp = None
            dl = None
            
            if plan == 'single':
                dl = 1
            elif plan == 'month':
                exp = datetime.now() + timedelta(days=30)
            elif plan == 'half_year':
                exp = datetime.now() + timedelta(days=180)
            elif plan == 'year':
                exp = datetime.now() + timedelta(days=365)
            
            cur.execute(f"UPDATE {schema}.payment_requests SET status = 'approved', approved_at = %s WHERE id = %s", (datetime.now(), rid))
            
            cur.execute(f"SELECT plan_type, downloads_left FROM {schema}.active_access WHERE email = %s", (email,))
            existing = cur.fetchone()
            
            if existing and plan == 'single':
                existing_downloads = existing[1] or 0
                new_downloads = existing_downloads + 1
                cur.execute(f"""
                    UPDATE {schema}.active_access 
                    SET downloads_left = %s, granted_at = CURRENT_TIMESTAMP
                    WHERE email = %s
                """, (new_downloads, email))
            elif existing and plan != 'single':
                cur.execute(f"""
                    UPDATE {schema}.active_access 
                    SET plan_type = %s, expires_at = %s, downloads_left = %s, granted_at = CURRENT_TIMESTAMP
                    WHERE email = %s
                """, (plan, exp, dl, email))
            else:
                cur.execute(f"""
                    INSERT INTO {schema}.active_access (email, plan_type, expires_at, downloads_left, granted_by)
                    VALUES (%s, %s, %s, %s, 'admin')
                """, (email, plan, exp, dl))
            
            conn.commit()
            
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True}), 'isBase64Encoded': False}
        
        elif action == 'reject':
            rid = int(params.get('id', 0))
            
            if not rid:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'ID required'}), 'isBase64Encoded': False}
            
            cur.execute(f"UPDATE {schema}.payment_requests SET status = 'rejected' WHERE id = %s", (rid,))
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True}), 'isBase64Encoded': False}
        
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Unknown action'}), 'isBase64Encoded': False}
    
    except Exception as e:
        print(f"ERROR in admin-direct: {str(e)}")
        import traceback
        traceback.print_exc()
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)}), 'isBase64Encoded': False}