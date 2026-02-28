CREATE TABLE eats_surge_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NULL,
  scope_type VARCHAR(20) NOT NULL,
  scope_value VARCHAR(100),
  name JSONB NOT NULL,
  priority INT DEFAULT 100,
  enabled BOOLEAN DEFAULT TRUE,
  conditions JSONB NOT NULL,
  action JSONB NOT NULL,
  time_windows JSONB DEFAULT '[]',
  max_daily_increase_percent INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_surge_scope ON eats_surge_rules(scope_type, scope_value, restaurant_id);
