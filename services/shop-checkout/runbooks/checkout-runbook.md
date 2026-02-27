# Runbook — Checkout (Brique 10)

## Vérifications rapides
- DB migrations: verify migrations/010_orders_checkout.sql applied.
- Secrets: DATABASE_URL, KAFKA_BROKERS, MOLAM_ID_JWKS present.
- Pods: kubectl -n molam get pods -l app=shop-checkout

## Incidents courants & résolution
1. **Validation failure (missing contact)**
   - Vérifier payload envoyé par client.
   - Vérifier logs API: kubectl logs deploy/shop-checkout.

2. **Payment failed**
   - Consulter shop_orders where status = 'FAILED'.
   - Vérifier payment provider logs (Molam / Stripe / Wave).
   - Si provider down, flag failover and queue orders.

3. **Duplicate orders**
   - Vérifier idempotency_key uniqueness.
   - Si doublon facturé, utiliser workflow remboursement (Molam Pay refund flow).

## Commandes utiles
```bash
# pending orders
psql $DATABASE_URL -c "SELECT id,user_id,status,total_amount FROM shop_orders WHERE status='PENDING' ORDER BY created_at DESC LIMIT 50;"

# replay failed payments
kubectl -n molam exec deploy/shop-checkout -- node scripts/replayFailedPayments.js
```

## Observability
- Prometheus metrics endpoint: /metrics
- Alerts: payment failure spike, checkout latency P95 > 2s, DB connection errors.

## Sécurité & conformité (résumé)
- Use Molam ID JWT for auth; never expose raw tokens.
- PII: store emails/phones with encryption at rest if required by jurisdiction. Mask in logs.
- Idempotency enforced by `idempotency_key`.
- Audit logs for payment & admin actions must be enabled elsewhere (admin module).
