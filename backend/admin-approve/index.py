import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Одобряет/отклоняет заявку и управляет доступом
    Args: event - dict с httpMethod, body (id, email, action: 'approve'/'reject')
          context - объект с атрибутами запроса
    Returns: HTTP response dict
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
        request_id = body_data.get('id')
        email = body_data.get('email')
        action = body_data.get('action', 'approve')
        
        if not request_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID обязателен'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'approve':
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен для одобрения'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'approved', approved_at = %s
                WHERE id = %s
            """, (datetime.now(), request_id))
            
            cur.execute("""
                INSERT INTO active_access (email, granted_by)
                VALUES (%s, 'admin')
                ON CONFLICT (email) 
                DO UPDATE SET granted_at = CURRENT_TIMESTAMP
            """, (email,))
            
            message = 'Доступ активирован'
        else:
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'rejected'
                WHERE id = %s
            """, (request_id,))
            
            message = 'Заявка отклонена'
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': message
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }