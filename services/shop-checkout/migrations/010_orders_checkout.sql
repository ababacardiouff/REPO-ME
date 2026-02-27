-- migrations/010_orders_checkout.sql
-- Addresses
CREATE TABLE IF NOT EXISTS shop_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  label VARCHAR(100),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(255),
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(50),
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS shop_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  address_id UUID NOT NULL,
  delivery_address_id UUID,
  total_amount BIGINT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(30) DEFAULT 'PENDING',
  payment_provider VARCHAR(50),
  payment_reference VARCHAR(255),
  idempotency_key VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS shop_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity INT NOT NULL,
  unit_price BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_shop_orders_idempotency ON shop_orders (idempotency_key);
