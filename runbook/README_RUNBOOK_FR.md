# Runbook — Brique 5 : Product Page (Molam Eats) — FR

## Objectif
Gérer incidents, replay outbox, FATIMA failures, haute latence.

## Commandes pratiques
- Check service: `kubectl -n molam get pods -l app=eats-product`
- Logs: `kubectl -n molam logs deploy/eats-product`
- Outbox lag: `psql $DATABASE_URL -c "SELECT count(*) FROM eats_outbox WHERE processed=false;"`
- Replay outbox: `node tools/replayOutbox.js --limit=100`

## Incidents courants
### 1) Outbox backlog > 1000
- Restart outbox worker: `kubectl -n molam rollout restart deploy/eats-product`
- If Kafka down: check brokers, restart Kafka or scale.

### 2) FATIMA unreachable
- Set env `FATIMA_MODE=queue-only` in deployment (helm values) and redeploy.
- Manually run `node scripts/replay_Fatima.js` after FATIMA back.

### 3) API latency high
- Check DB slow queries: `SELECT pid, query, state, now()-query_start AS duration FROM pg_stat_activity WHERE state='active' ORDER BY duration DESC LIMIT 10;`
- Scale replicas; examine recent deploys.

## Escalation
- Pager to infra on critical alerts (Outbox backlog / API errors >5%).
