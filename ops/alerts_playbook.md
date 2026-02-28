# Alerts playbook — Eats Holiday

- Alert: holiday-notifier failed 3 times
  - Check CronJob logs
  - Check DB connectivity and KAFKA_BROKERS
- Alert: pricing change not propagated
  - Verify `eats.pricing.changed`
  - Replay via `scripts/publish_holiday_change.js`
