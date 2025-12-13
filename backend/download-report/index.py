import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Учитывает скачивание отчёта и проверяет доступ
    Args: event - dict с httpMethod, body (email, calculation_data)
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
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'downloads_left': new_downloads_left,
                'message': 'Скачивание учтено'
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
