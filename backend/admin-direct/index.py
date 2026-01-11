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
                SELECT id, email, phone, screenshot_url, status, created_at, plan_type, amount 
                FROM {schema}.payment_requests 
                ORDER BY created_at DESC
            """)
            rows = cur.fetchall()
            
            result = []
            for r in rows:
                result.append({
                    'id': r[0],
                    'email': r[1],
                    'phone': r[2] or '',
                    'screenshot_url': r[3] or '',
                    'status': r[4],
                    'created_at': r[5].isoformat() if r[5] else '',
                    'plan_type': r[6],
                    'amount': r[7]
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
            
            cur.execute(f"""
                INSERT INTO {schema}.active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'admin')
                ON CONFLICT (email) DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
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
            cur.execute(f"""
                INSERT INTO {schema}.active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'admin')
                ON CONFLICT (email) DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
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
