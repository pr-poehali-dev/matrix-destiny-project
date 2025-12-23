-- Таблица для хранения расчётов матрицы пользователей
CREATE TABLE IF NOT EXISTS user_calculations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    personal INTEGER NOT NULL,
    destiny INTEGER NOT NULL,
    social INTEGER NOT NULL,
    spiritual INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_user_calculations_email ON user_calculations(email);

-- Индекс для сортировки по дате
CREATE INDEX IF NOT EXISTS idx_user_calculations_created_at ON user_calculations(created_at DESC);