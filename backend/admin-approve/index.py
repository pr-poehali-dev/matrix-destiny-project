import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Одобряет/отклоняет заявки и выдает доступ вручную
    """
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        
        body_data = json.loads(body_str)
        action = body_data.get('action', 'approve')
        email = body_data.get('email')
        plan_type = body_data.get('plan_type', 'month')
        request_id = body_data.get('id')
        
        print(f"DEBUG: action={action}, email={email}, plan_type={plan_type}, request_id={request_id}")
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'grant':
            if not email:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            expires_at = None
            downloads_left = None
            
            if plan_type == 'single':
                downloads_left = 1
            elif plan_type == 'month':
                expires_at = datetime.now() + timedelta(days=30)
            elif plan_type == 'half_year':
                expires_at = datetime.now() + timedelta(days=180)
            elif plan_type == 'year':
                expires_at = datetime.now() + timedelta(days=365)
            
            print(f"DEBUG: Inserting access for {email}, expires_at={expires_at}, downloads_left={downloads_left}")
            
            cur.execute("""
                INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'admin_manual')
                ON CONFLICT (email) 
                DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
            """, (email, plan_type, expires_at, downloads_left))
            
            conn.commit()
            cur.close()
            conn.close()
            
            print(f"DEBUG: Access granted successfully")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Доступ выдан'}),
                'isBase64Encoded': False
            }
        
        if action == 'approve':
            if not request_id or not email:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID и Email обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT plan_type FROM payment_requests WHERE id = %s", (request_id,))
            result = cur.fetchone()
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заявка не найдена'}),
                    'isBase64Encoded': False
                }
            
            plan_type = result[0]
            expires_at = None
            downloads_left = None
            
            if plan_type == 'single':
                downloads_left = 1
            elif plan_type == 'month':
                expires_at = datetime.now() + timedelta(days=30)
            elif plan_type == 'half_year':
                expires_at = datetime.now() + timedelta(days=180)
            elif plan_type == 'year':
                expires_at = datetime.now() + timedelta(days=365)
            
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'approved', approved_at = %s
                WHERE id = %s
            """, (datetime.now(), request_id))
            
            cur.execute("""
                INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'admin')
                ON CONFLICT (email) 
                DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
            """, (email, plan_type, expires_at, downloads_left))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Доступ активирован'}),
                'isBase64Encoded': False
            }
        
        if action == 'reject':
            if not request_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("UPDATE payment_requests SET status = 'rejected' WHERE id = %s", (request_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Заявка отклонена'}),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестное действие'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
