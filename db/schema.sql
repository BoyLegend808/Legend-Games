-- =========================================================
-- Legend Games / NaijaPlay - Master Database Schema
-- Compatible with SQLite, PostgreSQL, MySQL, and Supabase
-- =========================================================

CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    rating DECIMAL(3, 1) DEFAULT 9.0,
    release_year INT DEFAULT 2022,
    badge VARCHAR(100),
    ps4_size_gb INT DEFAULT 0,
    pc_size_gb INT DEFAULT 0,
    cd_price DECIMAL(10, 2) NOT NULL DEFAULT 15000.00,
    online_price DECIMAL(10, 2) NOT NULL DEFAULT 5000.00,
    modded_price DECIMAL(10, 2) NOT NULL DEFAULT 2000.00,
    cover_path VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_platforms (
    id INT PRIMARY KEY AUTO_INCREMENT, -- or INTEGER PRIMARY KEY AUTOINCREMENT in SQLite
    game_id VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(150),
    whatsapp_number VARCHAR(50) NOT NULL,
    meetup_location VARCHAR(255),
    items_json TEXT NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending WhatsApp Confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
