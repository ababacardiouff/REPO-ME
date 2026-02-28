CREATE TABLE eats_surge_rule_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID,
  actor_id UUID,
  action VARCHAR(20),
  diff JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
