import json
import os
import psycopg2
import requests
import boto3
import base64
import uuid
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Простая функция приема заявок на оплату
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
        plan_type = body_data.get('plan_type', 'single')
        amount = body_data.get('amount', 300)
        screenshot_base64 = body_data.get('screenshot', '')
        
        if not email:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email обязателен'}),
                'isBase64Encoded': False
            }
        
        screenshot_url = ''
        if screenshot_base64:
            try:
                if ',' in screenshot_base64:
                    screenshot_base64 = screenshot_base64.split(',')[1]
                
                screenshot_data = base64.b64decode(screenshot_base64)
                
                s3 = boto3.client('s3',
                    endpoint_url='https://bucket.poehali.dev',
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
                )
                
                file_ext = 'jpg'
                safe_email = email.replace('@', '_').replace('.', '_')
                file_key = f"payment-screenshots/{safe_email}_{uuid.uuid4()}.{file_ext}"
                
                s3.put_object(
                    Bucket='files',
                    Key=file_key,
                    Body=screenshot_data,
                    ContentType='image/jpeg'
                )
                
                screenshot_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
                print(f"Screenshot uploaded: {screenshot_url}")
            except Exception as upload_error:
                print(f"WARNING: Screenshot upload failed: {str(upload_error)}")
        
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute(f"""
            INSERT INTO {schema}.payment_requests (email, phone, status, plan_type, amount, screenshot_url)
            VALUES (%s, %s, 'pending', %s, %s, %s)
            RETURNING id
        """, (email, phone, plan_type, amount, screenshot_url))
        
        request_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        try:
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            chat_id = os.environ.get('TELEGRAM_CHAT_ID')
            
            if bot_token and chat_id:
                plan_labels = {
                    'single': 'Разовая расшифровка',
                    'month': '1 месяц безлимит',
                    'half_year': '6 месяцев безлимит',
                    'year': '12 месяцев безлимит'
                }
                
                admin_url = "https://preview--matrix-destiny-project.poehali.dev/admin"
                
                message = f"""🔔 *Новая заявка #{request_id}*

📧 Email: {email}"""
                
                if phone:
                    message += f"\n📱 Телефон: {phone}"
                
                message += f"""
💳 Тариф: {plan_labels.get(plan_type, plan_type)}
💰 Сумма: *{amount} ₽*
"""
                
                if screenshot_url:
                    message += f"\n📸 [Скриншот оплаты]({screenshot_url})"
                
                message += f"\n\n[Открыть админ-панель]({admin_url})"
                
                telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                response = requests.post(telegram_url, json={
                    'chat_id': chat_id,
                    'text': message,
                    'parse_mode': 'Markdown',
                    'disable_web_page_preview': True
                })
                
                if response.status_code != 200:
                    print(f"WARNING: Telegram notification failed: {response.text}")
        except Exception as telegram_error:
            print(f"WARNING: Telegram error (non-critical): {str(telegram_error)}")
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'request_id': request_id,
                'message': 'Заявка принята и сохранена в админке'
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }