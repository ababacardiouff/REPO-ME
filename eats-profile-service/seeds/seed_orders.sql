INSERT INTO eats_orders (id, profile_id, status, total_amount, created_at)
SELECT gen_random_uuid(), id, 'DELIVERED', 12000, now() - interval '7 days'
FROM eats_profiles WHERE email = 'awa.ndiaye@example.com';

INSERT INTO eats_orders (id, profile_id, status, total_amount, created_at)
SELECT gen_random_uuid(), id, 'PENDING', 8500, now()
FROM eats_profiles WHERE email = 'awa.ndiaye@example.com';

INSERT INTO eats_orders (id, profile_id, status, total_amount, created_at)
SELECT gen_random_uuid(), id, 'CANCELLED', 5000, now() - interval '2 days'
FROM eats_profiles WHERE email = 'moussa.diop@example.com';
