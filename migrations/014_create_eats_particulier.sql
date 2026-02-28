CREATE TABLE eats_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  molam_id UUID NOT NULL UNIQUE,
  country VARCHAR(8) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  language VARCHAR(8) NOT NULL,
  display_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  doc_container_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE eats_user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES eats_users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  line1 TEXT,
  line2 TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(30),
  country VARCHAR(8),
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE eats_user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES eats_users(id) ON DELETE CASCADE,
  kind VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE eats_user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES eats_users(id) ON DELETE CASCADE,
  device_info JSONB,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_eats_users_molam_id ON eats_users(molam_id);
