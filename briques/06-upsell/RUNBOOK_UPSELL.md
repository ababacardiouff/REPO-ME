# RUNBOOK — Upsell & Cross-sell (Brique 6)

## Incidents courants
1. FATIMA unreachable -> fallback: cached suggestion or rules-based defaults.
2. High latency or consumer lag -> check Kafka lag and scale replicas.
3. Wrong bundles -> inspect `upsell_audit_log` and `Fatima_suggestions_cache`.

## Monitoring metrics
- upsell_requests_total
- upsell_fatima_failures_total
- upsell_bundle_accepted_total
- upsell_latency_ms_p95

## Security / caveats
- Always validate Molam ID JWT for user-sensitive flows.
- Never expose personal data in upsell payloads.
- Respect locale and currency from Shop core.

## Ops checklist
- Ensure KAFKA_BROKERS and FATIMA endpoints are reachable.
- Ensure DB migrations applied.
- Ensure secrets are injected in `upsell-secrets`.
- Run smoke test: `curl /api/upsell/:productId`.
