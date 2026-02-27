# Runbook Ops — Eats Cart Admin

## Accès
- URL admin protégée + Molam ID SSO (agents internes uniquement).
- RBAC requis: `agent_internal:shop` ou `agent_admin:shop`.

## Vérifications rapides
- Logs service:
  ```bash
  kubectl -n molam logs deploy/eats-cart-admin
  ```
- Rejouer/forcer un schedule:
  ```bash
  curl -X POST http://eats-cart-admin/api/admin/cart/:cartId/schedules/:scheduleId/confirm
  ```
- Audit:
  ```sql
  SELECT * FROM admin_actions_audit ORDER BY created_at DESC LIMIT 20;
  ```

## Dépannage
- Si les workers ne créent pas les commandes:
  ```bash
  kubectl rollout restart deployment/eats-scheduled-orders
  ```
- Vérifier le topic Kafka `molam.admin.audit` et ses ACLs.

## Monitoring
- Endpoint `/metrics` expose `eats_admin_cart_items_mutations_total`.
- SLO recommandé: P95 checkout < 2s.
