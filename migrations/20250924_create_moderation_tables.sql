CREATE TABLE IF NOT EXISTS moderation_rules (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  threshold INT DEFAULT 50,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moderation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL,
  source_id UUID,
  content JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  fatima_response JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moderation_logs (
  id BIGSERIAL PRIMARY KEY,
  request_id UUID REFERENCES moderation_requests(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  actor VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT now()
);
