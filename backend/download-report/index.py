import json
import os
import base64
import smtplib
import psycopg2
from datetime import datetime
from typing import Dict, Any, Optional
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def send_pdf_email(recipient_email: str, recipient_name: str, pdf_base64: str) -> bool:
    """Отправка PDF на email клиента"""
    try:
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        
        if not all([smtp_user, smtp_password, smtp_host]):
            return False
        
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = recipient_email
        msg['Subject'] = f'Ваш персональный отчёт Матрица Судьбы - {recipient_name}'
        
        html_body = f'''
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2980b9;">Здравствуйте, {recipient_name}! 👋</h2>
            <p>Ваш <strong>персональный PDF-отчёт Матрица Судьбы</strong> готов!</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2980b9; margin-top: 0;">📊 В отчёте вы найдёте:</h3>
                <ul style="line-height: 1.8;">
                    <li>✨ Расшифровку всех 4 ключевых энергий</li>
                    <li>💊 Детальные рекомендации по здоровью</li>
                    <li>💕 Советы по отношениям и совместимости</li>
                    <li>💰 Стратегии финансов и карьеры</li>
                    <li>🎯 Профессии по вашему предназначению</li>
                </ul>
            </div>
            
            <p>PDF-файл прикреплён к этому письму.</p>
            
            <p style="margin-top: 30px;">
                <strong>Используйте эти знания для осознанной жизни! 🚀</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px;">
                Если у вас возникли вопросы, ответьте на это письмо или посетите наш сайт 
                <a href="https://xn----7sbbaano7aqfmvd0b8d.xn--p1ai" style="color: #2980b9;">о-тебе.рф</a>
            </p>
        </body>
        </html>
        '''
        
        msg.attach(MIMEText(html_body, 'html', 'utf-8'))
        
        pdf_data = base64.b64decode(pdf_base64)
        pdf_attachment = MIMEBase('application', 'pdf')
        pdf_attachment.set_payload(pdf_data)
        encoders.encode_base64(pdf_attachment)
        pdf_attachment.add_header(
            'Content-Disposition',
            f'attachment; filename="matrix-{recipient_name}.pdf"'
        )
        msg.attach(pdf_attachment)
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return True
    except:
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Учитывает скачивание отчёта, проверяет доступ и отправляет PDF на email
    Args: event - dict с httpMethod, body (email, calculation_data, pdf_base64, name)
          context - объект с атрибутами запроса
    Returns: HTTP response dict с подтверждением или ошибкой
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
        calculation_data = body_data.get('calculation_data', {})
        pdf_base64 = body_data.get('pdf_base64')
        user_name = body_data.get('name', 'Клиент')
        
        if not email:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email обязателен'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("""
            SELECT plan_type, expires_at, downloads_left
            FROM active_access
            WHERE email = %s
        """, (email,))
        
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Доступ не найден'}),
                'isBase64Encoded': False
            }
        
        plan_type, expires_at, downloads_left = result
        
        if expires_at and datetime.now() > expires_at:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Срок действия подписки истёк'}),
                'isBase64Encoded': False
            }
        
        if downloads_left is not None:
            if downloads_left <= 0:
                cur.close()
                conn.close()
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Использованы все доступные скачивания'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE active_access
                SET downloads_left = downloads_left - 1
                WHERE email = %s
            """, (email,))
        
        cur.execute("""
            INSERT INTO downloads (email, calculation_data)
            VALUES (%s, %s)
        """, (email, json.dumps(calculation_data)))
        
        conn.commit()
        
        cur.execute("""
            SELECT downloads_left FROM active_access WHERE email = %s
        """, (email,))
        
        new_downloads_left = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        # Отправляем PDF на email если предоставлен
        email_sent = False
        if pdf_base64:
            email_sent = send_pdf_email(email, user_name, pdf_base64)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'downloads_left': new_downloads_left,
                'message': 'Скачивание учтено',
                'email_sent': email_sent
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