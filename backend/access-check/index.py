import json
import os
import psycopg2
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

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
    
    # POST = получить список устройств, DELETE = выйти из сессии
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
        
        # Нормализуем заголовки к нижнему регистру (Cloud Functions могут отправлять в разных регистрах)
        headers_lower = {k.lower(): v for k, v in headers.items()}
        
        # Получаем настоящий IP из заголовков прокси
        forwarded_for = headers_lower.get('x-forwarded-for', '')
        source_ip = (
            forwarded_for.split(',')[0].strip() if forwarded_for else
            headers_lower.get('x-real-ip', '') or
            identity.get('sourceIp', 'unknown')
        )
        
        # Получаем User-Agent
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
            
            cur.execute("""
                DELETE FROM t_p85141447_matrix_destiny_proje.user_sessions
                WHERE email = %s AND ip_address = %s
            """, (email, source_ip))
            
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
            
            cur.execute("""
                SELECT ip_address, user_agent, last_activity, created_at
                FROM t_p85141447_matrix_destiny_proje.user_sessions
                WHERE email = %s AND last_activity > %s
                ORDER BY last_activity DESC
            """, (email, datetime.now() - timedelta(hours=24)))
            
            sessions = cur.fetchall()
            
            cur.execute("""
                SELECT max_devices, expires_at
                FROM t_p85141447_matrix_destiny_proje.active_access
                WHERE email = %s
            """, (email,))
            
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
        
        # GET: Проверка доступа (оригинальная функция)
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
            SELECT plan_type, expires_at, downloads_left, granted_at, max_devices
            FROM t_p85141447_matrix_destiny_proje.active_access
            WHERE email = %s
        """, (email,))
        
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
        
        # КРИТИЧЕСКАЯ ПРОВЕРКА: Истёк ли срок подписки
        if expires_at:
            now = datetime.now()
            if expires_at.tzinfo:
                from datetime import timezone
                now = datetime.now(timezone.utc)
            
            if now > expires_at:
                has_access = False
                message = 'Срок действия подписки истёк'
                
                # Логируем попытку доступа с истёкшей подпиской
                cur.execute("""
                    INSERT INTO t_p85141447_matrix_destiny_proje.security_logs (email, event_type, ip_address, user_agent, details)
                    VALUES (%s, 'expired_access', %s, %s, %s)
                """, (email, source_ip, user_agent, json.dumps({'expires_at': expires_at.isoformat()})))
                conn.commit()
        
        # КРИТИЧЕСКАЯ ПРОВЕРКА: Остались ли скачивания (для разового доступа)
        if downloads_left is not None and downloads_left <= 0:
            has_access = False
            message = 'Использованы все доступные скачивания'
        
        # НОВАЯ ПРОВЕРКА: Контроль количества устройств (защита от передачи аккаунта)
        if has_access and plan_type in ['month', 'half_year', 'year']:
            # КРИТИЧНО: Очищаем все сессии с IP прокси-сервера (неправильные данные)
            cur.execute("""
                DELETE FROM t_p85141447_matrix_destiny_proje.user_sessions 
                WHERE email = %s AND ip_address = '158.160.16.200'
            """, (email,))
            
            # Очищаем неактивные сессии (старше 24 часов)
            cur.execute("""
                DELETE FROM t_p85141447_matrix_destiny_proje.user_sessions 
                WHERE email = %s AND last_activity < %s
            """, (email, datetime.now() - timedelta(hours=24)))
            
            # Проверяем активные устройства
            cur.execute("""
                SELECT COUNT(DISTINCT ip_address) as device_count,
                       array_agg(DISTINCT ip_address) as ips
                FROM t_p85141447_matrix_destiny_proje.user_sessions
                WHERE email = %s AND last_activity > %s
            """, (email, datetime.now() - timedelta(hours=24)))
            
            device_check = cur.fetchone()
            active_device_count = device_check[0] if device_check else 0
            active_ips = device_check[1] if device_check and device_check[1] else []
            
            # Проверяем, не превышен ли лимит устройств
            if active_device_count >= (max_devices or 2) and source_ip not in active_ips:
                has_access = False
                message = f'Достигнут лимит устройств ({max_devices or 2}). Выйдите из аккаунта на другом устройстве.'
                
                # Логируем подозрительную активность
                cur.execute("""
                    INSERT INTO t_p85141447_matrix_destiny_proje.security_logs (email, event_type, ip_address, user_agent, details)
                    VALUES (%s, 'too_many_devices', %s, %s, %s)
                """, (email, source_ip, user_agent, json.dumps({
                    'active_devices': active_device_count,
                    'active_ips': active_ips,
                    'max_devices': max_devices
                })))
                conn.commit()
            elif has_access:
                # Создаём или обновляем сессию
                session_token = secrets.token_urlsafe(32)
                
                # Проверяем, есть ли уже сессия с этого IP
                cur.execute("""
                    SELECT session_token FROM t_p85141447_matrix_destiny_proje.user_sessions
                    WHERE email = %s AND ip_address = %s
                """, (email, source_ip))
                
                existing_session = cur.fetchone()
                
                if existing_session:
                    # Обновляем существующую сессию
                    cur.execute("""
                        UPDATE t_p85141447_matrix_destiny_proje.user_sessions
                        SET last_activity = %s, user_agent = %s
                        WHERE email = %s AND ip_address = %s
                    """, (datetime.now(), user_agent, email, source_ip))
                    session_token = existing_session[0]
                else:
                    # Создаём новую сессию
                    cur.execute("""
                        INSERT INTO t_p85141447_matrix_destiny_proje.user_sessions (email, ip_address, user_agent, session_token)
                        VALUES (%s, %s, %s, %s)
                    """, (email, source_ip, user_agent, session_token))
                
                # Обновляем последний вход
                cur.execute("""
                    UPDATE t_p85141447_matrix_destiny_proje.active_access
                    SET last_login_at = %s, last_login_ip = %s
                    WHERE email = %s
                """, (datetime.now(), source_ip, email))
                
                conn.commit()
        
        cur.close()
        conn.close()
        
        response_data = {
            'has_access': has_access,
            'plan_type': plan_type,
            'expires_at': expires_at.isoformat() if expires_at else None,
            'downloads_left': downloads_left,
            'granted_at': granted_at.isoformat() if granted_at else None,
            'message': message
        }
        
        if session_token:
            response_data['session_token'] = session_token
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(response_data),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }