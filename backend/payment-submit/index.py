import json
import os
import psycopg2
import boto3
import base64
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Принимает заявку на оплату от пользователя
    Args: event - dict с httpMethod, body (email, phone, screenshot base64)
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
        body_data = json.loads(event.get('body', '{}'))
        email = body_data.get('email')
        phone = body_data.get('phone', '')
        screenshot_base64 = body_data.get('screenshot', '')
        filename = body_data.get('filename', 'screenshot.jpg')
        plan_type = body_data.get('plan_type', 'single')
        amount = body_data.get('amount', 200)
        
        if not email:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email обязателен'}),
                'isBase64Encoded': False
            }
        
        screenshot_url = None
        
        if screenshot_base64:
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            )
            
            if ',' in screenshot_base64:
                screenshot_base64 = screenshot_base64.split(',')[1]
            
            screenshot_data = base64.b64decode(screenshot_base64)
            
            key = f'payment-screenshots/{email.replace("@", "_")}_{context.request_id}.jpg'
            
            s3.put_object(
                Bucket='files',
                Key=key,
                Body=screenshot_data,
                ContentType='image/jpeg'
            )
            
            screenshot_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO payment_requests (email, phone, screenshot_url, status, plan_type, amount)
            VALUES (%s, %s, %s, 'pending', %s, %s)
            RETURNING id
        """, (email, phone, screenshot_url, plan_type, amount))
        
        request_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        try:
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            chat_id = os.environ.get('TELEGRAM_CHAT_ID')
            
            print(f"DEBUG: bot_token exists: {bool(bot_token)}, chat_id exists: {bool(chat_id)}")
            
            if bot_token and chat_id:
                plan_labels = {
                    'single': 'Разовая расшифровка',
                    'month': '1 месяц безлимит',
                    'half_year': '6 месяцев безлимит',
                    'year': '12 месяцев безлимит'
                }
                
                message = f"🔔 <b>Новая заявка на оплату!</b>\n\n"
                message += f"📧 Email: <code>{email}</code>\n"
                if phone:
                    message += f"📱 Телефон: {phone}\n"
                message += f"💳 Тариф: <b>{plan_labels.get(plan_type, plan_type)}</b>\n"
                message += f"💰 Сумма: {amount} ₽\n"
                message += f"🆔 ID заявки: {request_id}\n"
                if screenshot_url:
                    message += f"\n📸 <a href='{screenshot_url}'>Скриншот оплаты</a>"
                
                keyboard = {
                    'inline_keyboard': [
                        [
                            {'text': '✅ Одобрить', 'callback_data': f'approve_{request_id}'},
                            {'text': '❌ Отклонить', 'callback_data': f'reject_{request_id}'}
                        ]
                    ]
                }
                
                print(f"DEBUG: Sending Telegram message to chat_id: {chat_id}")
                telegram_response = requests.post(
                    f'https://api.telegram.org/bot{bot_token}/sendMessage',
                    json={
                        'chat_id': chat_id,
                        'text': message,
                        'parse_mode': 'HTML',
                        'reply_markup': keyboard
                    },
                    timeout=5
                )
                print(f"DEBUG: Telegram response status: {telegram_response.status_code}, body: {telegram_response.text}")
            else:
                print("WARNING: Telegram bot_token or chat_id not configured")
        except Exception as telegram_error:
            print(f"ERROR sending Telegram notification: {str(telegram_error)}")
            import traceback
            traceback.print_exc()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'request_id': request_id,
                'message': 'Заявка принята'
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