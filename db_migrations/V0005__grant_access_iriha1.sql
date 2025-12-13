-- Выдаем годовой доступ для iriha1@bk.ru
INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by, granted_at) 
VALUES ('iriha1@bk.ru', 'year', NOW() + INTERVAL '365 days', NULL, 'admin_direct', NOW()) 
ON CONFLICT (email) 
DO UPDATE SET 
    plan_type = 'year', 
    expires_at = NOW() + INTERVAL '365 days', 
    downloads_left = NULL, 
    granted_at = NOW();
