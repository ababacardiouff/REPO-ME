#!/usr/bin/env bash
set -euo pipefail

echo "Reconciling orders vs Molam Pay ledger..."
DB_URL=${DATABASE_URL:-"postgres://molam:password@localhost/molam"}

psql "$DB_URL" -c "
COPY (
  SELECT id, payment_reference, total_amount, currency, status, created_at
  FROM shop_orders
  WHERE created_at > now() - interval '1 day'
) TO STDOUT WITH CSV HEADER;
" > /tmp/orders_last24h.csv

echo "Exported /tmp/orders_last24h.csv"
echo "Next step: fetch Molam Pay ledger and diff"
