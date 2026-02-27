-- migrations/006_create_upsell_tables.sql
-- Upsell & Cross-sell tables, cache and audit

CREATE TABLE upsell_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  premium_product_id UUID NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE cross_sell_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  complementary_product_id UUID NOT NULL REFERENCES products(id),
  score FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Fatima_suggestions_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  user_id UUID,
  payload JSONB NOT NULL,
  ttl TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(product_id, user_id)
);

CREATE TABLE upsell_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(50) NOT NULL,
  source VARCHAR(50) NOT NULL,
  data JSONB,
  created_at TIMESTAMP DEFAULT now()
);
