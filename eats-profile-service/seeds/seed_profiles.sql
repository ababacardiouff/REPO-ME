INSERT INTO eats_profiles (id, user_id, first_name, last_name, email, phone, locale, currency)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Awa', 'Ndiaye', 'awa.ndiaye@example.com', '+221770000001', 'fr', 'XOF'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Moussa', 'Diop', 'moussa.diop@example.com', '+221770000002', 'fr', 'XOF'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Fatou', 'Ba', 'fatou.ba@example.com', '+221770000003', 'fr', 'XOF');
