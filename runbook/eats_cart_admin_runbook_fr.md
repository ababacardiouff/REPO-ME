# Runbook Ops FR — Panier multi-jours & commandes différées (Admin)

## Symptômes
- Panier ne sauvegarde pas les dates futures.
- Checkout échoue ou trop lent.
- Workers n’exécutent pas les commandes programmées.

## Étapes
- DB check
  ```bash
  psql $DATABASE_URL -c "SELECT * FROM eats_cart_items ORDER BY created_at DESC LIMIT 5;"
  ```
- Kafka backlog
  ```bash
  kafka-consumer-groups --describe --group scheduled-orders
  ```
- Worker restart
  ```bash
  kubectl rollout restart deployment/eats-scheduled-orders
  ```
- API debug
  ```bash
  curl -X POST http://eats-cart/api/cart/{cartId}/checkout
  ```

## Monitoring
- Vérifier `eats_cart_items_added_total` (croissance stable).
- Vérifier `eats_cart_checkout_latency_seconds` P95 < 2s.
- Vérifier `eats_admin_cart_items_mutations_total` (activité Ops).
