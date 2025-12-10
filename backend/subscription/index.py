import json
import os
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def get_db_connection():
    '''Создает подключение к базе данных'''
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление подписками пользователей: создание, проверка статуса, получение доступа
    Args: event - содержит httpMethod, body, queryStringParameters
          context - объект контекста с атрибутами request_id и др.
    Returns: HTTP response dict с данными подписки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            email = body_data.get('email')
            name = body_data.get('name')
            subscription_type = body_data.get('subscription_type')
            payment_id = body_data.get('payment_id')
            
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            
            if not user:
                cursor.execute(
                    "INSERT INTO users (email, name) VALUES (%s, %s) RETURNING id",
                    (email, name)
                )
                user_id = cursor.fetchone()[0]
            else:
                user_id = user[0]
            
            duration_map = {
                'single': timedelta(days=1),
                'month': timedelta(days=30),
                'half_year': timedelta(days=180),
                'year': timedelta(days=365)
            }
            
            start_date = datetime.now()
            end_date = start_date + duration_map.get(subscription_type, timedelta(days=1))
            
            cursor.execute(
                """INSERT INTO subscriptions 
                   (user_id, subscription_type, status, start_date, end_date) 
                   VALUES (%s, %s, 'active', %s, %s) 
                   RETURNING id""",
                (user_id, subscription_type, start_date, end_date)
            )
            subscription_id = cursor.fetchone()[0]
            
            cursor.execute(
                """INSERT INTO payments 
                   (user_id, subscription_id, payment_id, amount, status) 
                   VALUES (%s, %s, %s, %s, 'succeeded')""",
                (user_id, subscription_id, payment_id, body_data.get('amount', 0))
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'subscription_id': subscription_id,
                    'user_id': user_id,
                    'status': 'active',
                    'end_date': end_date.isoformat()
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            email = event.get('queryStringParameters', {}).get('email')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'email required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                """SELECT s.id, s.subscription_type, s.status, s.start_date, s.end_date
                   FROM subscriptions s
                   JOIN users u ON s.user_id = u.id
                   WHERE u.email = %s AND s.status = 'active' AND s.end_date > NOW()
                   ORDER BY s.end_date DESC
                   LIMIT 1""",
                (email,)
            )
            
            subscription = cursor.fetchone()
            
            if subscription:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'has_access': True,
                        'subscription_type': subscription[1],
                        'status': subscription[2],
                        'end_date': subscription[4].isoformat() if subscription[4] else None
                    }),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'has_access': False}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
