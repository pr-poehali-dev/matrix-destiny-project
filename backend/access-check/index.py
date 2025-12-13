import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Проверяет доступ пользователя по email
    Args: event - dict с httpMethod, queryStringParameters (email)
          context - объект с атрибутами запроса
    Returns: HTTP response dict с информацией о доступе
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters', {})
        email = params.get('email')
        
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
            SELECT plan_type, expires_at, downloads_left, granted_at
            FROM active_access
            WHERE email = %s
        """, (email,))
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if not result:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'has_access': False,
                    'message': 'Доступ не найден. Возможно, заявка ещё не одобрена.'
                }),
                'isBase64Encoded': False
            }
        
        plan_type, expires_at, downloads_left, granted_at = result
        
        has_access = True
        message = None
        
        if expires_at:
            if datetime.now() > expires_at:
                has_access = False
                message = 'Срок действия подписки истёк'
        
        if downloads_left is not None and downloads_left <= 0:
            has_access = False
            message = 'Использованы все доступные скачивания'
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'has_access': has_access,
                'plan_type': plan_type,
                'expires_at': expires_at.isoformat() if expires_at else None,
                'downloads_left': downloads_left,
                'granted_at': granted_at.isoformat() if granted_at else None,
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
