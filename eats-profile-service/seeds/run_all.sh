#!/bin/bash
set -e

DB_URL=${DATABASE_URL:-"postgres://postgres:password@localhost:5432/molam_eats"}

echo "🌱 Seeding Molam Eats profiles, addresses, payments, orders..."

psql "$DB_URL" -f seeds/seed_profiles.sql
psql "$DB_URL" -f seeds/seed_addresses.sql
psql "$DB_URL" -f seeds/seed_payments.sql
psql "$DB_URL" -f seeds/seed_orders.sql

echo "✅ Seeding complete!"
