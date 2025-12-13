import json
import os
import psycopg2
import requests
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Обрабатывает нажатия на кнопки в Telegram (одобрение/отклонение заявок)
    Args: event - dict с httpMethod, body (callback от Telegram)
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        if 'callback_query' not in body_data:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True}),
                'isBase64Encoded': False
            }
        
        callback_query = body_data['callback_query']
        callback_data = callback_query['data']
        callback_id = callback_query['id']
        message = callback_query['message']
        chat_id = message['chat']['id']
        message_id = message['message_id']
        
        action, request_id_str = callback_data.split('_', 1)
        request_id = int(request_id_str)
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'approve':
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'approved', approved_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING email, plan_type
            """, (request_id,))
            
            result = cur.fetchone()
            if not result:
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Request not found'}),
                    'isBase64Encoded': False
                }
            
            email, plan_type = result
            
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
                INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'telegram_admin')
                ON CONFLICT (email) 
                DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
            """, (email, plan_type, expires_at, downloads_left))
            
            conn.commit()
            
            new_status = 'одобрена ✅'
            status_emoji = '✅'
        elif action == 'reject':
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'rejected', approved_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING email
            """, (request_id,))
            
            result = cur.fetchone()
            if result:
                email = result[0]
            
            conn.commit()
            
            new_status = 'отклонена ❌'
            status_emoji = '❌'
        else:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        
        if bot_token:
            updated_text = message['text'] + f"\n\n{status_emoji} <b>Статус: {new_status}</b>"
            
            requests.post(
                f'https://api.telegram.org/bot{bot_token}/editMessageText',
                json={
                    'chat_id': chat_id,
                    'message_id': message_id,
                    'text': updated_text,
                    'parse_mode': 'HTML'
                },
                timeout=5
            )
            
            requests.post(
                f'https://api.telegram.org/bot{bot_token}/answerCallbackQuery',
                json={
                    'callback_query_id': callback_id,
                    'text': f'Заявка {new_status}!'
                },
                timeout=5
            )
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }