CREATE DATABASE IF NOT EXISTS nexus_med;
USE nexus_med;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products (Medicines) table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  dosage VARCHAR(255) NOT NULL,
  pack_size VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  stock_count INT NOT NULL DEFAULT 100,
  requires_rx BOOLEAN DEFAULT FALSE,
  image_url TEXT NOT NULL,
  badge VARCHAR(50),
  rating DECIMAL(3,2) DEFAULT 4.8,
  reviews_count INT DEFAULT 120,
  active_ingredient VARCHAR(255),
  usage_instructions TEXT,
  side_effects TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  shipping_address JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  razorpay_payment_id VARCHAR(255) NOT NULL,
  razorpay_signature VARCHAR(512),
  status VARCHAR(50) NOT NULL DEFAULT 'CAPTURED',
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
