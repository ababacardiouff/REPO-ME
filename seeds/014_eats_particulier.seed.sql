INSERT INTO eats_users (molam_id, country, currency, language, display_name, email)
VALUES
('00000000-0000-0000-0000-000000000001', 'SN', 'XOF', 'fr', 'Test User', 'user@example.com')
ON CONFLICT DO NOTHING;
