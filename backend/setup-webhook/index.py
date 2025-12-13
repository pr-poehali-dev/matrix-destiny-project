import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Устанавливает вебхук для Telegram бота
    Args: event - dict с httpMethod
          context - объект с атрибутами запроса
    Returns: HTTP response dict
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
    
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        webhook_url = 'https://functions.poehali.dev/fd359d26-35ad-43cb-abd8-9072b92efe6d'
        
        if not bot_token:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN не настроен'}),
                'isBase64Encoded': False
            }
        
        response = requests.get(
            f'https://api.telegram.org/bot{bot_token}/setWebhook',
            params={'url': webhook_url},
            timeout=10
        )
        
        result = response.json()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'telegram_response': result,
                'webhook_url': webhook_url
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
