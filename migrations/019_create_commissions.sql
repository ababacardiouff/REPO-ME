CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id varchar NOT NULL,
  vendor_id varchar NOT NULL,
  commission_amount decimal(10,2) NOT NULL,
  vendor_earning decimal(10,2) NOT NULL,
  paid_out boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_vendor_paid_out
  ON commissions(vendor_id, paid_out);

CREATE UNIQUE INDEX IF NOT EXISTS uq_commissions_order_id
  ON commissions(order_id);
