# Runbook Eats Menu

- Vérifier backlog outbox:
  - `SELECT count(*) FROM eats_outbox WHERE processed=false;`
- Si backlog > 10k:
  - `kubectl rollout restart deploy/eats-outbox-worker`
- FATIMA timeout:
  - Vérifier `$FATIMA_URL/health`
  - Basculer en mode queue-only
- Restaurer suppression category:
  - rollback via DB snapshot + notification Ops
- Metrics à surveiller:
  - `eats.menu.create_rate`
  - `eats.Fatima.validation_failures`
  - `eats.outbox.lag`
