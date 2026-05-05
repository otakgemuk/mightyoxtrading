-- Initialize Prop Firms Database
-- This file runs automatically when the MySQL container starts

-- Create database
CREATE DATABASE IF NOT EXISTS prop_firms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE prop_firms_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unionId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  email VARCHAR(320),
  avatar LONGTEXT,
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignInAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_unionId (unionId),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create prop_firms table
CREATE TABLE IF NOT EXISTS prop_firms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  tagline VARCHAR(500),
  description LONGTEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  affiliate_url VARCHAR(500),
  founded_year INT,
  platforms JSON,
  payout_schedule VARCHAR(100),
  profit_split VARCHAR(50),
  trust_score DECIMAL(3,1),
  best_for_tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firm_id BIGINT NOT NULL UNSIGNED,
  name VARCHAR(255) NOT NULL,
  account_size INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  profit_target DECIMAL(5,2) NOT NULL,
  daily_drawdown DECIMAL(5,2) NOT NULL,
  max_drawdown DECIMAL(5,2) NOT NULL,
  minimum_days INT DEFAULT 0,
  consistency_rule LONGTEXT,
  reset_fee DECIMAL(10,2) DEFAULT 0,
  activation_fee DECIMAL(10,2) DEFAULT 0,
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  phase2_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (firm_id) REFERENCES prop_firms(id) ON DELETE CASCADE,
  INDEX idx_firm_id (firm_id),
  INDEX idx_account_size (account_size)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create trading_rules table
CREATE TABLE IF NOT EXISTS trading_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firm_id BIGINT NOT NULL UNSIGNED,
  category ENUM('allowed', 'prohibited', 'payout_invalidation', 'live_specific') NOT NULL,
  rule LONGTEXT NOT NULL,
  detail LONGTEXT,
  severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
  order_index INT DEFAULT 0,
  FOREIGN KEY (firm_id) REFERENCES prop_firms(id) ON DELETE CASCADE,
  INDEX idx_firm_id (firm_id),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create country_restrictions table
CREATE TABLE IF NOT EXISTS country_restrictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firm_id BIGINT NOT NULL UNSIGNED,
  country_code VARCHAR(2) NOT NULL,
  country_name VARCHAR(255) NOT NULL,
  status ENUM('allowed', 'restricted', 'restricted_live_only') NOT NULL,
  notes LONGTEXT,
  FOREIGN KEY (firm_id) REFERENCES prop_firms(id) ON DELETE CASCADE,
  INDEX idx_firm_id (firm_id),
  INDEX idx_country_code (country_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNSIGNED,
  firm_id BIGINT NOT NULL UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (firm_id) REFERENCES prop_firms(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_firm_id (firm_id),
  UNIQUE KEY unique_user_firm (user_id, firm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create educational_content table
CREATE TABLE IF NOT EXISTS educational_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content LONGTEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add admin user
INSERT INTO users (unionId, name, email, role)
VALUES ('admin', 'Administrator', 'admin@proprfirms.local', 'admin')
ON DUPLICATE KEY UPDATE unionId=unionId;

-- Enable query caching
SET GLOBAL query_cache_size = 268435456;
SET GLOBAL query_cache_type = 1;

-- Print completion message
SELECT 'Database initialized successfully!' as status;
