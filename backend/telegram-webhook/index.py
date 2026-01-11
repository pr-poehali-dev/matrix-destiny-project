import json
import os
import psycopg2
import requests
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Webhook для Telegram бота
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
        body_data = json.loads(event.get('body', '{}'))
        print(f"DEBUG: Received webhook: {json.dumps(body_data)}")
        
        # Обработка callback query (нажатие на кнопку)
        if 'callback_query' in body_data:
            callback = body_data['callback_query']
            callback_id = callback['id']
            message = callback['message']
            chat_id = message['chat']['id']
            message_id = message['message_id']
            callback_data = callback['data']
            
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            
            # Парсим callback_data: "approve_123" или "reject_123"
            action, request_id = callback_data.split('_')
            request_id = int(request_id)
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            if action == 'approve':
                # Получаем данные заявки
                cur.execute("""
                    SELECT email, plan_type FROM payment_requests WHERE id = %s
                """, (request_id,))
                result = cur.fetchone()
                
                if not result:
                    cur.close()
                    conn.close()
                    
                    # Уведомляем пользователя
                    requests.post(f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery", json={
                        'callback_query_id': callback_id,
                        'text': '❌ Заявка не найдена',
                        'show_alert': True
                    })
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'ok': True}),
                        'isBase64Encoded': False
                    }
                
                email, plan_type = result
                
                # Обновляем статус заявки
                cur.execute("""
                    UPDATE payment_requests 
                    SET status = 'approved', approved_at = %s
                    WHERE id = %s
                """, (datetime.now(), request_id))
                
                # Выдаём доступ
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
                    VALUES (%s, %s, %s, %s, 'telegram')
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
                
                # Обновляем сообщение
                new_text = message['text'] + f"\n\n✅ *ОДОБРЕНО* администратором"
                requests.post(f"https://api.telegram.org/bot{bot_token}/editMessageText", json={
                    'chat_id': chat_id,
                    'message_id': message_id,
                    'text': new_text,
                    'parse_mode': 'Markdown',
                    'disable_web_page_preview': True
                })
                
                # Уведомляем пользователя
                requests.post(f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery", json={
                    'callback_query_id': callback_id,
                    'text': f'✅ Доступ выдан для {email}',
                    'show_alert': False
                })
                
            elif action == 'reject':
                # Обновляем статус заявки
                cur.execute("""
                    UPDATE payment_requests 
                    SET status = 'rejected'
                    WHERE id = %s
                """, (request_id,))
                
                conn.commit()
                cur.close()
                conn.close()
                
                # Обновляем сообщение
                new_text = message['text'] + f"\n\n❌ *ОТКЛОНЕНО* администратором"
                requests.post(f"https://api.telegram.org/bot{bot_token}/editMessageText", json={
                    'chat_id': chat_id,
                    'message_id': message_id,
                    'text': new_text,
                    'parse_mode': 'Markdown',
                    'disable_web_page_preview': True
                })
                
                # Уведомляем пользователя
                requests.post(f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery", json={
                    'callback_query_id': callback_id,
                    'text': '❌ Заявка отклонена',
                    'show_alert': False
                })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True}),
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