CREATE TABLE IF NOT EXISTS eats_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NULL,
  scope_type VARCHAR(20) NOT NULL,
  scope_value VARCHAR(100),
  name JSONB NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  recurring_rule VARCHAR(200),
  is_blackout BOOLEAN DEFAULT FALSE,
  pricing_adjustment JSONB,
  applies_to JSONB DEFAULT '["menu_items","delivery","service"]',
  priority INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_holidays_scope ON eats_holidays(scope_type, scope_value);
CREATE INDEX IF NOT EXISTS idx_holidays_restaurant ON eats_holidays(restaurant_id);
