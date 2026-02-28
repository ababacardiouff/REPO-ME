INSERT INTO users (id, first_name, last_name, email, lang)
VALUES ('11111111-1111-1111-1111-111111111113', 'Alice', 'Doe', 'alice@example.com', 'fr')
ON CONFLICT DO NOTHING;

INSERT INTO vendors (id, business_name)
VALUES ('11111111-1111-1111-1111-111111111112', 'Molam Eats Vendor')
ON CONFLICT DO NOTHING;

INSERT INTO orders (id, vendor_id, buyer_id, currency, total_amount, tax_amount)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111112',
  '11111111-1111-1111-1111-111111111113',
  'XOF',
  10000,
  1800
) ON CONFLICT DO NOTHING;

INSERT INTO invoices (id, order_id, tenant_id, issuer_id, recipient_id, currency, total_amount, tax_amount, language, status)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111112',
  '11111111-1111-1111-1111-111111111113',
  'XOF',
  10000,
  1800,
  'fr',
  'PENDING'
) ON CONFLICT DO NOTHING;
