CREATE TABLE eats_profiles (
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
