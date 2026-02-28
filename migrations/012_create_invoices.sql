CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  issuer_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  currency VARCHAR(8) NOT NULL,
  total_amount NUMERIC(18,2) NOT NULL,
  tax_amount NUMERIC(18,2) DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  pdf_path TEXT,
  language VARCHAR(8) DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON invoices(tenant_id);
