CREATE TABLE eats_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES eats_profiles(id),
  provider VARCHAR(50) NOT NULL,
  token TEXT NOT NULL,
  last4 VARCHAR(4),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
