CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS eats_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  molam_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  country_code VARCHAR(5) NOT NULL,
  language_code VARCHAR(5) DEFAULT 'fr',
  status VARCHAR(20) DEFAULT 'active',
  fatima_score INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eats_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_code VARCHAR(50) UNIQUE NOT NULL,
  role_name JSONB NOT NULL,
  description JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS eats_agent_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES eats_agents(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES eats_roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT now(),
  assigned_by UUID NOT NULL,
  UNIQUE (agent_id, role_id)
);

CREATE TABLE IF NOT EXISTS eats_agent_logs (
  id BIGSERIAL PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES eats_agents(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  context JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eats_agents_molam_id ON eats_agents(molam_id);
CREATE INDEX IF NOT EXISTS idx_eats_agents_status ON eats_agents(status);
CREATE INDEX IF NOT EXISTS idx_eats_agent_roles_agent ON eats_agent_roles(agent_id);
CREATE INDEX IF NOT EXISTS idx_eats_agent_logs_agent ON eats_agent_logs(agent_id);
