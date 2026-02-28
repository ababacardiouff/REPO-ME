CREATE TABLE eats_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES eats_profiles(id),
  status VARCHAR(30) NOT NULL,
  total_amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'XOF',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
