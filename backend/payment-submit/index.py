import json
import os
import psycopg2
import boto3
import base64
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
            INSERT INTO payment_requests (email, phone, screenshot_url, status)
            VALUES (%s, %s, %s, 'pending')
            RETURNING id
        """, (email, phone, screenshot_url))
        
        request_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
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
