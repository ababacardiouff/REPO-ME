CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS eats_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  sku_code VARCHAR(128) UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  images JSONB DEFAULT '[]'::jsonb,
  category_id UUID,
  price_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  country CHAR(2) DEFAULT 'SN',
  stock INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  Fatima_score INT DEFAULT 100,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eats_products_vendor ON eats_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_eats_products_sku ON eats_products(sku_code);
CREATE INDEX IF NOT EXISTS idx_eats_products_category ON eats_products(category_id);

CREATE TABLE IF NOT EXISTS eats_product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES eats_products(id) ON DELETE CASCADE,
  variant_code VARCHAR(128) UNIQUE NOT NULL,
  attributes JSONB DEFAULT '{}'::jsonb,
  price_cents BIGINT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_product_events (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES eats_products(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_orders_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  product_id UUID,
  sku_id UUID,
  buyer_id UUID,
  order_amount_cents BIGINT,
  currency CHAR(3),
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_outbox (
  id BIGSERIAL PRIMARY KEY,
  aggregate_type VARCHAR(100),
  aggregate_id UUID,
  event_type VARCHAR(100),
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);
