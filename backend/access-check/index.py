import json
import os
import psycopg2
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def escape_sql_string(value: str) -> str:
    """Экранирует строку для SQL запроса"""
    return value.replace("'", "''")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Проверяет доступ пользователя к функционалу по email
    """
    
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method not in ['GET', 'POST', 'DELETE']:
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        request_context = event.get('requestContext', {})
        identity = request_context.get('identity', {})
        headers = event.get('headers', {})
        
        headers_lower = {k.lower(): v for k, v in headers.items()}
        
        forwarded_for = headers_lower.get('x-forwarded-for', '')
        source_ip = (
            forwarded_for.split(',')[0].strip() if forwarded_for else
            headers_lower.get('x-real-ip', '') or
            identity.get('sourceIp', 'unknown')
        )
        
        user_agent = headers_lower.get('user-agent', 'unknown')
        
        # DELETE: Выход из сессии
        if method == 'DELETE':
            body = json.loads(event.get('body', '{}'))
            email = body.get('email')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            email_esc = escape_sql_string(email)
            ip_esc = escape_sql_string(source_ip)
            
            cur.execute(f"""
                DELETE FROM t_p85141447_matrix_destiny_proje.user_sessions
                WHERE email = '{email_esc}' AND ip_address = '{ip_esc}'
            """)
            
            deleted_count = cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Сессия завершена',
                    'sessions_deleted': deleted_count
                }),
                'isBase64Encoded': False
            }
        
        # POST: Получить список активных устройств
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            email = body.get('email')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            email_esc = escape_sql_string(email)
            threshold_time = (datetime.now() - timedelta(hours=24)).isoformat()
            
            cur.execute(f"""
                SELECT ip_address, user_agent, last_activity, created_at
                FROM t_p85141447_matrix_destiny_proje.user_sessions
                WHERE email = '{email_esc}' AND last_activity > '{threshold_time}'
                ORDER BY last_activity DESC
            """)
            
            sessions = cur.fetchall()
            
            cur.execute(f"""
                SELECT max_devices, expires_at
                FROM t_p85141447_matrix_destiny_proje.active_access
                WHERE email = '{email_esc}'
            """)
            
            access_info = cur.fetchone()
            max_devices = access_info[0] if access_info else 2
            expires_at = access_info[1] if access_info else None
            
            cur.close()
            conn.close()
            
            devices = []
            for session in sessions:
                ip_addr, ua, last_act, created = session
                
                device_type = 'Unknown'
                if ua:
                    ua_lower = ua.lower()
                    if 'mobile' in ua_lower or 'android' in ua_lower or 'iphone' in ua_lower:
                        device_type = 'Mobile'
                    elif 'tablet' in ua_lower or 'ipad' in ua_lower:
                        device_type = 'Tablet'
                    else:
                        device_type = 'Desktop'
                
                devices.append({
                    'ip_address': ip_addr,
                    'device_type': device_type,
                    'user_agent': ua[:100] if ua else 'Unknown',
                    'last_activity': last_act.isoformat(),
                    'created_at': created.isoformat(),
                    'is_current': ip_addr == source_ip
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'devices': devices,
                    'active_count': len(devices),
                    'max_devices': max_devices,
                    'expires_at': expires_at.isoformat() if expires_at else None
                }),
                'isBase64Encoded': False
            }
        
        # GET: Проверка доступа
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
        
        email_esc = escape_sql_string(email)
        
        cur.execute(f"""
            SELECT plan_type, expires_at, downloads_left, granted_at, max_devices
            FROM t_p85141447_matrix_destiny_proje.active_access
            WHERE email = '{email_esc}'
        """)
        
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'has_access': False,
                    'message': 'Доступ не найден. Возможно, заявка ещё не одобрена.'
                }),
                'isBase64Encoded': False
            }
        
        plan_type, expires_at, downloads_left, granted_at, max_devices = result
        
        has_access = True
        message = None
        session_token = None
        
        # Проверка срока подписки
        if expires_at:
            now = datetime.now()
            if expires_at.tzinfo:
                from datetime import timezone
                now = datetime.now(timezone.utc)
            
            if now > expires_at:
                has_access = False
                message = 'Срок действия подписки истёк'
                
                now_iso = now.isoformat()
                ip_esc = escape_sql_string(source_ip)
                ua_esc = escape_sql_string(user_agent)
                
                cur.execute(f"""
                    INSERT INTO t_p85141447_matrix_destiny_proje.security_logs (email, event_type, ip_address, user_agent, details)
                    VALUES ('{email_esc}', 'expired_access', '{ip_esc}', '{ua_esc}', 'Попытка доступа с истёкшей подпиской')
                """)
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'has_access': False,
                        'message': message,
                        'expires_at': expires_at.isoformat()
                    }),
                    'isBase64Encoded': False
                }
        
        # Проверка лимита устройств
        threshold_time = (datetime.now() - timedelta(hours=24)).isoformat()
        
        cur.execute(f"""
            SELECT COUNT(DISTINCT ip_address) 
            FROM t_p85141447_matrix_destiny_proje.user_sessions 
            WHERE email = '{email_esc}' AND last_activity > '{threshold_time}'
        """)
        
        active_devices_count = cur.fetchone()[0]
        
        # Проверяем, есть ли активная сессия для текущего устройства
        ip_esc = escape_sql_string(source_ip)
        
        cur.execute(f"""
            SELECT session_token 
            FROM t_p85141447_matrix_destiny_proje.user_sessions 
            WHERE email = '{email_esc}' AND ip_address = '{ip_esc}' AND last_activity > '{threshold_time}'
        """)
        
        existing_session = cur.fetchone()
        
        if existing_session:
            session_token = existing_session[0]
            
            now_iso = datetime.now().isoformat()
            cur.execute(f"""
                UPDATE t_p85141447_matrix_destiny_proje.user_sessions 
                SET last_activity = '{now_iso}'
                WHERE email = '{email_esc}' AND ip_address = '{ip_esc}'
            """)
            conn.commit()
        else:
            # Новое устройство
            if active_devices_count >= (max_devices or 2):
                has_access = False
                message = f'Превышен лимит устройств ({max_devices or 2}). Выйдите с одного из устройств.'
                
                now_iso = datetime.now().isoformat()
                ua_esc = escape_sql_string(user_agent)
                
                cur.execute(f"""
                    INSERT INTO t_p85141447_matrix_destiny_proje.security_logs (email, event_type, ip_address, user_agent, details)
                    VALUES ('{email_esc}', 'device_limit_exceeded', '{ip_esc}', '{ua_esc}', 'Попытка входа с нового устройства при превышении лимита')
                """)
                conn.commit()
            else:
                # Создаём новую сессию
                session_token = secrets.token_urlsafe(32)
                now_iso = datetime.now().isoformat()
                token_esc = escape_sql_string(session_token)
                ua_esc = escape_sql_string(user_agent)
                
                cur.execute(f"""
                    INSERT INTO t_p85141447_matrix_destiny_proje.user_sessions 
                    (email, session_token, ip_address, user_agent, created_at, last_activity)
                    VALUES ('{email_esc}', '{token_esc}', '{ip_esc}', '{ua_esc}', '{now_iso}', '{now_iso}')
                """)
                conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'has_access': has_access,
                'message': message,
                'plan_type': plan_type,
                'expires_at': expires_at.isoformat() if expires_at else None,
                'downloads_left': downloads_left,
                'granted_at': granted_at.isoformat() if granted_at else None,
                'session_token': session_token,
                'active_devices': active_devices_count,
                'max_devices': max_devices or 2
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
