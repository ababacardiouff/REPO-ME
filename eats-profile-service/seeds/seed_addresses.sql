INSERT INTO eats_addresses (id, profile_id, label, street, city, country, is_default)
SELECT gen_random_uuid(), id, 'Home', 'Dakar Plateau, Rue 3', 'Dakar', 'Sénégal', true
FROM eats_profiles WHERE email = 'awa.ndiaye@example.com';

INSERT INTO eats_addresses (id, profile_id, label, street, city, country, is_default)
SELECT gen_random_uuid(), id, 'Work', 'Almadies, Route des Almadies', 'Dakar', 'Sénégal', false
FROM eats_profiles WHERE email = 'moussa.diop@example.com';
