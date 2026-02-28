INSERT INTO eats_holidays (
  id, restaurant_id, scope_type, name, start_date, end_date, is_blackout, pricing_adjustment, applies_to, priority, created_at, updated_at
)
VALUES (
  gen_random_uuid(),
  'resto-1',
  'restaurant',
  '{"en":"Christmas","fr":"Noël"}',
  '2025-12-24',
  '2025-12-26',
  false,
  '{"type":"percent","value":20}',
  '["menu_items","delivery"]',
  5,
  now(),
  now()
);
