#!/usr/bin/env bash
set -euo pipefail

BOOTSTRAP="${KAFKA_BOOTSTRAP:-localhost:9092}"

for t in eats.holiday.created eats.holiday.updated eats.holiday.deleted eats.pricing.changed eats.holiday.upcoming eats.blackout.changed; do
  kafka-topics --bootstrap-server "$BOOTSTRAP" --create --topic "$t" --partitions 3 --replication-factor 1 || true
  echo "topic ensured: $t"
done
