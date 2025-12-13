import json
import os
import psycopg2
import boto3
import base64
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
            smtp_host = os.environ.get('SMTP_HOST')
            smtp_port = os.environ.get('SMTP_PORT')
            smtp_user = os.environ.get('SMTP_USER')
            smtp_password = os.environ.get('SMTP_PASSWORD')
            admin_email = os.environ.get('ADMIN_EMAIL')
            
            print(f"DEBUG: SMTP configured: {bool(smtp_host and smtp_port and smtp_user and smtp_password and admin_email)}")
            
            if smtp_host and smtp_port and smtp_user and smtp_password and admin_email:
                plan_labels = {
                    'single': 'Разовая расшифровка',
                    'month': '1 месяц безлимит',
                    'half_year': '6 месяцев безлимит',
                    'year': '12 месяцев безлимит'
                }
                
                msg = MIMEMultipart('alternative')
                msg['Subject'] = f'🔔 Новая заявка #{request_id} на оплату'
                msg['From'] = smtp_user
                msg['To'] = admin_email
                
                admin_url = f"https://preview--matrix-destiny-project.poehali.dev/admin"
                
                html_body = f"""
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                        .content {{ background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                        .info-row {{ margin: 15px 0; padding: 12px; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; }}
                        .info-label {{ font-weight: bold; color: #667eea; display: inline-block; min-width: 120px; }}
                        .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }}
                        .button:hover {{ background: #5568d3; }}
                        .screenshot {{ margin: 15px 0; }}
                        .screenshot a {{ color: #667eea; text-decoration: none; font-weight: bold; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin: 0;">🔔 Новая заявка на оплату!</h2>
                        </div>
                        <div class="content">
                            <div class="info-row">
                                <span class="info-label">📧 Email:</span>
                                <span>{email}</span>
                            </div>
                """
                
                if phone:
                    html_body += f"""
                            <div class="info-row">
                                <span class="info-label">📱 Телефон:</span>
                                <span>{phone}</span>
                            </div>
                    """
                
                html_body += f"""
                            <div class="info-row">
                                <span class="info-label">💳 Тариф:</span>
                                <span>{plan_labels.get(plan_type, plan_type)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">💰 Сумма:</span>
                                <span><strong>{amount} ₽</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">🆔 ID заявки:</span>
                                <span>#{request_id}</span>
                            </div>
                """
                
                if screenshot_url:
                    html_body += f"""
                            <div class="screenshot">
                                <p><strong>📸 Скриншот оплаты:</strong></p>
                                <a href="{screenshot_url}" target="_blank">Открыть скриншот в новой вкладке →</a>
                            </div>
                    """
                
                html_body += f"""
                            <div style="margin-top: 30px; text-align: center;">
                                <a href="{admin_url}" class="button">Открыть админ-панель</a>
                            </div>
                            <p style="margin-top: 30px; color: #666; font-size: 14px; text-align: center;">
                                В админ-панели вы можете одобрить или отклонить заявку
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                part = MIMEText(html_body, 'html')
                msg.attach(part)
                
                print(f"DEBUG: Sending email to {admin_email}")
                server = smtplib.SMTP(smtp_host, int(smtp_port))
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(smtp_user, admin_email, msg.as_string())
                server.quit()
                print(f"DEBUG: Email sent successfully to {admin_email}")
            else:
                print("WARNING: SMTP not configured, skipping email notification")
        except Exception as email_error:
            print(f"ERROR sending email notification: {str(email_error)}")
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