CREATE TABLE IF NOT EXISTS eats_vendor_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES eats_vendors(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_vendor_role ON eats_vendor_roles(vendor_id, user_id, role);
