#!/usr/bin/env bash
BOOT="${KAFKA_BOOTSTRAP:-localhost:9092}"
topics=(eats.surge.rule.created eats.surge.rule.updated eats.surge.rule.deleted eats.surge.evaluated eats.surge.changed eats.surge.alerts)
for t in "${topics[@]}"; do
  kafka-topics --bootstrap-server "${BOOT}" --create --topic "$t" --partitions 6 --replication-factor 1 || true
done
