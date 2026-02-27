#!/usr/bin/env bash
export DATABASE_URL=${DATABASE_URL:-postgresql://molam:password@localhost:5432/molam_eats}
psql "$DATABASE_URL" -c "SELECT count(*) FROM eats_outbox WHERE processed=false;"
