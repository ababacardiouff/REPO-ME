# GameDay Chaos Playbook — Molam Eats Checkout

## Avant GameDay
- Informer SRE, Ops, Product, Support.
- Vérifier backups DB et commandes rollback.
- Vérifier Prometheus + Alertmanager + Jaeger + Kafka.

## Exécution (Molam Pay outage)
1. Baseline métriques (5 min).
2. Simuler panne:
   - `./chaos/scripts/simulate_service_down.sh --namespace molam --deployment molam-pay --duration 300`
3. Observer alertes `MolamPayDown`, `CheckoutErrorSpike`, `CheckoutLatencySpike`.
4. Si impact élevé, restaurer immédiatement et activer fallback:
   - `kubectl -n molam scale deployment molam-pay --replicas=1`
   - `kubectl -n molam set env deployment/eats-checkout CHECKOUT_FALLBACK_MODE=true`
   - `kubectl -n molam rollout restart deployment/eats-checkout`

## Après GameDay
- Export logs / traces / métriques.
- Vérifier que la backlog Kafka est drainée.
- Lancer postmortem sous 48h.
