# Runbook — Brique 18 — Surge Pricing & Dynamic Delivery Fees

1) Incident : Surge rules not applied at checkout
- Check kafka topic `eats.surge.evaluated`
- Test evaluate endpoint: POST /api/surge/restaurants/<id>/evaluate with context
- Check worker surgeMonitor logs; ensure Redis active state updated.

2) Incident : FATIMA veto unexpected
- Check FATIMA endpoint health; inspect payload sent to FATIMA (request id)
- If transient, fallback to conservative (no surge) and raise alert.

3) Incident : Surge runaway (fees > configured caps)
- Inspect last 24h adjustments and sum of daily increase per restaurant.
- If exceeded maxDailyIncreasePercent, roll back by disabling offending rules and notify ops.

4) Maintenance:
- Create topics if missing (scripts/create_kafka_topics_surge.sh)
- Re-run seeds in staging

Alerts:
- surgeEvaluationLatency p95 > 500ms
- abnormal surge alerts → Pager duty
