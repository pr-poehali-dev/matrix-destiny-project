import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Возвращает список заявок на оплату или проверяет доступ пользователя
    Args: event - dict с httpMethod, queryStringParameters (email для проверки доступа)
          context - объект с атрибутами запроса
    Returns: HTTP response dict с массивом заявок или статусом доступа
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters', {})
        check_email = params.get('email') if params else None
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if check_email:
            cur.execute("""
                SELECT COUNT(*) FROM active_access 
                WHERE email = %s
                AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
            """, (check_email,))
            
            count = cur.fetchone()[0]
            has_access = count > 0
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'hasAccess': has_access,
                    'email': check_email
                }),
                'isBase64Encoded': False
            }
        
        cur.execute("""
            SELECT id, email, phone, screenshot_url, status, created_at, notes
            FROM payment_requests
            ORDER BY 
                CASE 
                    WHEN status = 'pending' THEN 1
                    WHEN status = 'approved' THEN 2
                    ELSE 3
                END,
                created_at DESC
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
                'notes': row[6]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'requests': requests}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }