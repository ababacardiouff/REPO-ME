\set N 1000

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS eats_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(30),
  locale VARCHAR(10) DEFAULT 'fr',
  currency VARCHAR(10) DEFAULT 'XOF',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES eats_profiles(id) ON DELETE CASCADE,
  label VARCHAR(120),
  street TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES eats_profiles(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  token TEXT NOT NULL,
  last4 VARCHAR(4),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES eats_profiles(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  total_amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'XOF',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

WITH seq AS (
  SELECT generate_series(1, :N) AS i
),
profiles AS (
  INSERT INTO eats_profiles (user_id, first_name, last_name, email, phone, locale, currency)
  SELECT
    gen_random_uuid(),
    ('User' || i)::text,
    ('Test' || i)::text,
    ('user' || i || '@example.com')::text,
    ('+22177' || lpad((100000 + i)::text, 6, '0'))::text,
    CASE WHEN (i % 3)=0 THEN 'en' WHEN (i % 3)=1 THEN 'fr' ELSE 'wo' END,
    CASE WHEN (i % 4)=0 THEN 'USD' WHEN (i % 4)=1 THEN 'EUR' WHEN (i % 4)=2 THEN 'XOF' ELSE 'GHS' END
  FROM seq
  RETURNING id, user_id
)
INSERT INTO eats_addresses (profile_id, label, street, city, country, is_default)
SELECT p.id, 'Home' || (' ' || substring(p.user_id::text from 1 for 6)),
       ('Street ' || trunc(random()*1000)::int || ', Building ' || trunc(random()*200)::int),
       'Dakar',
       'Senegal',
       true
FROM profiles p;

WITH chosen AS (
  SELECT id FROM eats_profiles ORDER BY random() LIMIT (SELECT trunc(:N * 0.2)::int)
)
INSERT INTO eats_addresses (profile_id, label, street, city, country, is_default)
SELECT id, 'Work', ('Work Address '|| trunc(random()*1000)::int), 'City' || trunc(random()*50)::int, 'Country', false
FROM chosen;

WITH p AS (
  SELECT id FROM eats_profiles
)
INSERT INTO eats_payment_methods (profile_id, provider, token, last4, is_default)
SELECT
  p.id,
  (ARRAY['MolamPay','Stripe','Visa','Mastercard'])[floor(random()*4 + 1)]::text,
  ('tok_' || substr(md5(random()::text),1,20)),
  substr(md5(random()::text),1,4),
  true
FROM p;

WITH extra AS (
  SELECT id FROM eats_profiles ORDER BY random() LIMIT (SELECT trunc(:N * 0.10)::int)
)
INSERT INTO eats_payment_methods (profile_id, provider, token, last4, is_default)
SELECT
  id,
  (ARRAY['Stripe','Visa','Mastercard','MolamPay'])[floor(random()*4 + 1)]::text,
  ('tok_' || substr(md5(random()::text),1,20)),
  substr(md5(random()::text),1,4),
  false
FROM extra;

WITH p AS (
  SELECT id FROM eats_profiles
),
order_counts AS (
  SELECT id, (floor(random()*6))::int as cnt FROM p
)
INSERT INTO eats_orders (profile_id, status, total_amount, currency, created_at)
SELECT
  oc.id,
  (ARRAY['PENDING','PREPARING','ON_THE_WAY','DELIVERED','CANCELLED'])[floor(random()*5 + 1)]::text,
  (500 + floor(random()*19500))::int,
  (CASE WHEN (random() < 0.25) THEN 'USD' WHEN (random() < 0.5) THEN 'EUR' WHEN (random() < 0.75) THEN 'XOF' ELSE 'GHS' END),
  now() - ((trunc(random()*30)) || ' days')::interval
FROM order_counts oc, generate_series(1, oc.cnt);

SELECT 'SEED_SUMMARY' as tag,
       (SELECT count(*) FROM eats_profiles) as profiles,
       (SELECT count(*) FROM eats_addresses) as addresses,
       (SELECT count(*) FROM eats_payment_methods) as payments,
       (SELECT count(*) FROM eats_orders) as orders;
