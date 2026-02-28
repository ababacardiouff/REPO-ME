CREATE TABLE eats_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES eats_restaurants(id) ON DELETE CASCADE,
  timezone VARCHAR(64) NOT NULL,
  lead_time_minutes INT DEFAULT 0,
  max_simultaneous_orders INT DEFAULT 50,
  pre_order_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (restaurant_id)
);

CREATE TABLE eats_schedule_weekly_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES eats_schedules(id) ON DELETE CASCADE,
  weekday INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_open BOOLEAN DEFAULT TRUE,
  position INT DEFAULT 0
);

CREATE TABLE eats_schedule_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES eats_schedules(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_open BOOLEAN DEFAULT FALSE,
  note TEXT
);

CREATE TABLE eats_order_load (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES eats_restaurants(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (restaurant_id, window_start, window_end)
);

CREATE INDEX idx_load_restaurant_window ON eats_order_load(restaurant_id, window_start, window_end);
