# Runbook — Brique 16 — Schedule & Availability

## Incidents courants

### 1) Orders rejected due to `lead_time_not_met`
- Vérifier `leadTimeMinutes` sur le schedule du restaurant.
- Vérifier la timezone serveur et la timezone IANA stockée en DB.
- En cas de changement DST, vérifier les rules et exceptions de la date concernée.

### 2) Capacity full (`capacity_full`)
- Inspecter `eats_order_load`:
```bash
psql $DATABASE_URL -c "SELECT * FROM eats_order_load WHERE restaurant_id='...' ORDER BY window_start DESC LIMIT 20;"
```
- Si le consumer est bloqué, relancer le worker de charge.

### 3) Cron job failing
- `kubectl logs cronjob/eats-schedule-validator <job-pod>`
- Vérifier image tag + variables `DATABASE_URL`, `KAFKA_BROKERS`.

## Maintenance
- Recompute nightly order load snapshots.
- Export weekly availability snapshots for analytics.

## Alerting
- Alerte si erreurs scheduleValidator > 5/h.
- Alerte si latence p95 availability > 500ms.
