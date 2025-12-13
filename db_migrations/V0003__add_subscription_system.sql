-- Добавляем колонку для типа тарифа в payment_requests
ALTER TABLE payment_requests 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'single' CHECK (plan_type IN ('single', 'month', 'half_year', 'year', 'admin'));

-- Добавляем колонку для суммы оплаты
ALTER TABLE payment_requests 
ADD COLUMN IF NOT EXISTS amount INTEGER;

-- Обновляем таблицу active_access для поддержки разных тарифов
ALTER TABLE active_access 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'single' CHECK (plan_type IN ('single', 'month', 'half_year', 'year', 'admin'));

ALTER TABLE active_access 
ADD COLUMN IF NOT EXISTS downloads_left INTEGER;

-- Добавляем администратора (твой email для безлимитного доступа)
INSERT INTO active_access (email, plan_type, expires_at, downloads_left, granted_by)
VALUES ('admin@matrix.local', 'admin', NULL, NULL, 'system')
ON CONFLICT (email) DO NOTHING;

-- Создаем таблицу для хранения скачиваний (история)
CREATE TABLE IF NOT EXISTS downloads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calculation_data JSONB
);

CREATE INDEX idx_downloads_email ON downloads(email);
CREATE INDEX idx_downloads_date ON downloads(downloaded_at DESC);