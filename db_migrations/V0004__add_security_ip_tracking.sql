-- Добавляем систему отслеживания IP для предотвращения передачи аккаунтов
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_email ON user_sessions(email);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_activity ON user_sessions(last_activity DESC);

-- Добавляем лимит на количество активных устройств (максимум 2 устройства)
ALTER TABLE active_access 
ADD COLUMN IF NOT EXISTS max_devices INTEGER DEFAULT 2;

-- Добавляем отслеживание последней активности
ALTER TABLE active_access 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

ALTER TABLE active_access 
ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45);

-- Создаем таблицу для логирования подозрительных действий
CREATE TABLE IF NOT EXISTS security_logs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_logs_email ON security_logs(email);
CREATE INDEX idx_security_logs_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_date ON security_logs(created_at DESC);