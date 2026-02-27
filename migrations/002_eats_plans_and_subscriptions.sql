CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS eats_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name JSONB NOT NULL,
  price_cents BIGINT NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  article_quota INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO eats_plans (code, name, price_cents, currency, article_quota)
SELECT * FROM (VALUES
  ('PARTICULIER', '{"fr":"Particulier","en":"Individual"}', 0, 'USD', 3),
  ('PRO',         '{"fr":"Professionnel","en":"Professional"}', 3500, 'USD', 7),
  ('ENTREPRISE',  '{"fr":"Entreprise","en":"Enterprise"}', 4500, 'USD', NULL)
) AS v(code, name, price_cents, currency, article_quota)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS eats_vendor_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  plan_code VARCHAR(50) NOT NULL REFERENCES eats_plans(code),
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  payment_provider VARCHAR(50),
  payment_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(vendor_id, current_period_end)
);

CREATE TABLE IF NOT EXISTS eats_articles_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  period_year INT NOT NULL,
  period_month INT NOT NULL,
  used_articles INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(vendor_id, period_year, period_month)
);

CREATE INDEX IF NOT EXISTS idx_eats_vendor_subscriptions_vendor ON eats_vendor_subscriptions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_eats_articles_usage_vendor_period ON eats_articles_usage(vendor_id, period_year, period_month);
