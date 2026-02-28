INSERT INTO eats_payment_methods (id, profile_id, provider, token, last4, is_default)
SELECT gen_random_uuid(), id, 'MolamPay', 'tok_test_awa', '1234', true
FROM eats_profiles WHERE email = 'awa.ndiaye@example.com';

INSERT INTO eats_payment_methods (id, profile_id, provider, token, last4, is_default)
SELECT gen_random_uuid(), id, 'Stripe', 'tok_test_moussa', '5678', true
FROM eats_profiles WHERE email = 'moussa.diop@example.com';
