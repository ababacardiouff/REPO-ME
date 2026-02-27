CREATE TABLE IF NOT EXISTS eats_vendor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES eats_vendors(id) ON DELETE CASCADE,
  doc_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  storage_provider VARCHAR(50) DEFAULT 's3',
  status VARCHAR(20) DEFAULT 'UPLOADED',
  Fatima_flags JSONB DEFAULT '{}'::jsonb,
  uploaded_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eats_vendor_documents_vendor_id ON eats_vendor_documents(vendor_id);
