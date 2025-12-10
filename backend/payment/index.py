import json
import os
import base64
import requests
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обработка платежей через ЮKassa: создание платежа и проверка статуса
    Args: event - содержит httpMethod, body, queryStringParameters
          context - объект контекста с атрибутами request_id и др.
    Returns: HTTP response dict с данными платежа
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Payment system not configured'}),
            'isBase64Encoded': False
        }
    
    auth_string = f"{shop_id}:{secret_key}"
    auth_encoded = base64.b64encode(auth_string.encode()).decode()
    headers = {
        'Authorization': f'Basic {auth_encoded}',
        'Content-Type': 'application/json',
        'Idempotence-Key': context.request_id
    }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        subscription_type = body_data.get('subscription_type')
        user_email = body_data.get('email')
        user_name = body_data.get('name')
        
        price_map = {
            'single': 200.00,
            'month': 1000.00,
            'half_year': 5000.00,
            'year': 10000.00
        }
        
        amount = price_map.get(subscription_type)
        if not amount:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid subscription type'}),
                'isBase64Encoded': False
            }
        
        payment_data = {
            'amount': {
                'value': f'{amount:.2f}',
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': body_data.get('return_url', 'https://your-domain.com')
            },
            'capture': True,
            'description': f'Матрица Судьбы - {subscription_type}',
            'metadata': {
                'subscription_type': subscription_type,
                'user_email': user_email,
                'user_name': user_name
            }
        }
        
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            headers=headers,
            json=payment_data,
            timeout=10
        )
        
        if response.status_code == 200:
            payment_info = response.json()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'payment_id': payment_info['id'],
                    'confirmation_url': payment_info['confirmation']['confirmation_url'],
                    'status': payment_info['status']
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Payment creation failed', 'details': response.text}),
                'isBase64Encoded': False
            }
    
    elif method == 'GET':
        payment_id = event.get('queryStringParameters', {}).get('payment_id')
        if not payment_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'payment_id required'}),
                'isBase64Encoded': False
            }
        
        response = requests.get(
            f'https://api.yookassa.ru/v3/payments/{payment_id}',
            headers={'Authorization': f'Basic {auth_encoded}'},
            timeout=10
        )
        
        if response.status_code == 200:
            payment_info = response.json()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'payment_id': payment_info['id'],
                    'status': payment_info['status'],
                    'paid': payment_info.get('paid', False)
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Payment check failed'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
