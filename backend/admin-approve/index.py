import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Одобряет/отклоняет заявку и управляет доступом
    Args: event - dict с httpMethod, body (id, email, action: 'approve'/'reject')
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
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        body_data = json.loads(body_str)
        request_id = body_data.get('id')
        email = body_data.get('email')
        action = body_data.get('action', 'approve')
        plan_type = body_data.get('plan_type')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        if action == 'grant':
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            if not plan_type:
                plan_type = 'month'
            
            expires_at = None
            downloads_left = None
            
            if plan_type == 'single':
                downloads_left = 1
            elif plan_type == 'month':
                expires_at = datetime.now() + timedelta(days=30)
            elif plan_type == 'half_year':
                expires_at = datetime.now() + timedelta(days=180)
            elif plan_type == 'year':
                expires_at = datetime.now() + timedelta(days=365)
            
            cur.execute("""
                INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'admin_manual')
                ON CONFLICT (email) 
                DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
            """, (email, plan_type, expires_at, downloads_left))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Доступ выдан'
                }),
                'isBase64Encoded': False
            }
        
        if not request_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID обязателен'}),
                'isBase64Encoded': False
            }
        
        if action == 'approve':
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен для одобрения'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT plan_type FROM payment_requests WHERE id = %s
            """, (request_id,))
            result = cur.fetchone()
            plan_type = result[0] if result else 'single'
            
            expires_at = None
            downloads_left = None
            
            if plan_type == 'single':
                downloads_left = 1
            elif plan_type == 'month':
                expires_at = datetime.now() + timedelta(days=30)
            elif plan_type == 'half_year':
                expires_at = datetime.now() + timedelta(days=180)
            elif plan_type == 'year':
                expires_at = datetime.now() + timedelta(days=365)
            
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'approved', approved_at = %s
                WHERE id = %s
            """, (datetime.now(), request_id))
            
            cur.execute("""
                INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by)
                VALUES (%s, %s, %s, %s, 'admin')
                ON CONFLICT (email) 
                DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type,
                    expires_at = EXCLUDED.expires_at,
                    downloads_left = EXCLUDED.downloads_left,
                    granted_at = CURRENT_TIMESTAMP
            """, (email, plan_type, expires_at, downloads_left))
            
            message = 'Доступ активирован'
        else:
            cur.execute("""
                UPDATE payment_requests 
                SET status = 'rejected'
                WHERE id = %s
            """, (request_id,))
            
            message = 'Заявка отклонена'
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
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