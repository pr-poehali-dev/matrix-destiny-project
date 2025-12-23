import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Админ API: GET - список заявок, POST - одобрение/отклонение/выдача доступа
    Публичный доступ без авторизации
    """
    method: str = event.get('httpMethod', 'GET')
    
    print(f"[ADMIN] === NEW REQUEST ===")
    print(f"[ADMIN] Method: {method}")
    print(f"[ADMIN] Headers: {event.get('headers', {})}")
    print(f"[ADMIN] Query: {event.get('queryStringParameters', {})}")
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        # GET - список заявок
        if method == 'GET':
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            cur.execute("""
                SELECT id, email, phone, screenshot_url, status, created_at, plan_type, amount
                FROM payment_requests
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            requests = []
            for row in rows:
                requests.append({
                    'id': row[0],
                    'email': row[1],
                    'phone': row[2],
                    'screenshot_url': row[3],
                    'status': row[4],
                    'created_at': row[5].isoformat() if row[5] else None,
                    'plan_type': row[6],
                    'amount': row[7]
                })
            
            cur.close()
            conn.close()
            
            print(f"[ADMIN] ✅ Returning {len(requests)} requests")
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({'requests': requests}),
                'isBase64Encoded': False
            }
        
        # POST - действия (approve/reject/grant)
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'approve')
            email = body_data.get('email')
            plan_type = body_data.get('plan_type', 'month')
            request_id = body_data.get('id')
            
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            # Выдать доступ вручную
            if action == 'grant':
                print(f"[ADMIN GRANT] email={email}, plan_type={plan_type}")
                
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
                
                print(f"[ADMIN GRANT] expires_at={expires_at}, downloads_left={downloads_left}")
                
                try:
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
                    print(f"[ADMIN GRANT] ✅ SUCCESS! Access granted to {email}")
                except Exception as db_error:
                    print(f"[ADMIN GRANT] ❌ DATABASE ERROR: {str(db_error)}")
                    import traceback
                    traceback.print_exc()
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Database error: {str(db_error)}'}),
                        'isBase64Encoded': False
                    }
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Доступ выдан'}),
                    'isBase64Encoded': False
                }
            
            # Одобрить заявку
            elif action == 'approve':
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
            
            # Отклонить заявку
            elif action == 'reject':
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
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }