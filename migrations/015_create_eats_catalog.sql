CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS eats_restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID,
  molam_id UUID NOT NULL,
  name JSONB NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description JSONB,
  logo_url TEXT,
  country VARCHAR(8),
  currency VARCHAR(8),
  language VARCHAR(8),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eats_restaurants_molam ON eats_restaurants(molam_id);

CREATE TABLE IF NOT EXISTS eats_catalog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES eats_restaurants(id) ON DELETE CASCADE,
  code VARCHAR(80) NOT NULL,
  name JSONB NOT NULL,
  position INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES eats_restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES eats_catalog_categories(id) ON DELETE SET NULL,
  sku VARCHAR(100) UNIQUE,
  name JSONB NOT NULL,
  description JSONB,
  images JSONB,
  price NUMERIC(12,2) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  stock INT DEFAULT NULL,
  prep_time_minutes INT DEFAULT 0,
  is_delivery_only BOOLEAN DEFAULT FALSE,
  external_flags JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eats_catalog_items_restaurant ON eats_catalog_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_eats_catalog_items_sku ON eats_catalog_items(sku);
CREATE INDEX IF NOT EXISTS eats_catalog_items_gin ON eats_catalog_items USING gin((name->>'fr') gin_trgm_ops);

CREATE TABLE IF NOT EXISTS eats_catalog_item_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES eats_catalog_items(id) ON DELETE CASCADE,
  code VARCHAR(80) NOT NULL,
  name JSONB NOT NULL,
  price_delta NUMERIC(12,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_catalog_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_molam_id UUID,
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
