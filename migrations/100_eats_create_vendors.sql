CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS eats_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_type VARCHAR(20) NOT NULL,
  business_name JSONB,
  primary_category VARCHAR(100),
  languages JSONB DEFAULT '[]'::jsonb,
  currency CHAR(3),
  country CHAR(2),
  status VARCHAR(20) DEFAULT 'PENDING',
  Fatima_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eats_vendors_user_id ON eats_vendors(user_id);
