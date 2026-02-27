CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE eats_menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  code VARCHAR(100),
  name JSONB NOT NULL,
  parent_id UUID,
  position INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE eats_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  category_id UUID REFERENCES eats_menu_categories(id) ON DELETE SET NULL,
  sku_code VARCHAR(100) UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  default_price_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  availability JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(30) DEFAULT 'draft',
  fatima_quality_score INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE eats_menu_skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES eats_menu_items(id) ON DELETE CASCADE,
  sku_code VARCHAR(100) UNIQUE NOT NULL,
  price_cents BIGINT NOT NULL,
  stock INT DEFAULT 0,
  attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE eats_modifier_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  name JSONB NOT NULL,
  rules JSONB NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE eats_modifier_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES eats_modifier_groups(id) ON DELETE CASCADE,
  sku_id UUID REFERENCES eats_menu_skus(id),
  name JSONB NOT NULL,
  price_delta_cents BIGINT DEFAULT 0,
  position INT DEFAULT 0
);

CREATE TABLE eats_item_modifier_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES eats_menu_items(id) ON DELETE CASCADE,
  modifier_group_id UUID NOT NULL REFERENCES eats_modifier_groups(id) ON DELETE CASCADE
);

CREATE TABLE eats_allergens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name JSONB NOT NULL
);

CREATE TABLE eats_item_allergens (
  item_id UUID NOT NULL REFERENCES eats_menu_items(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES eats_allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, allergen_id)
);

CREATE TABLE eats_outbox (
  id BIGSERIAL PRIMARY KEY,
  aggregate_type VARCHAR(100),
  aggregate_id UUID,
  event_type VARCHAR(100),
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_eats_items_vendor ON eats_menu_items(vendor_id);
CREATE INDEX idx_eats_skus_item ON eats_menu_skus(item_id);
