CREATE TABLE IF NOT EXISTS admin_actions_audit (
  id SERIAL PRIMARY KEY,
  agent_id UUID NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  target_cart UUID,
  payload JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_cart ON admin_actions_audit (target_cart);
