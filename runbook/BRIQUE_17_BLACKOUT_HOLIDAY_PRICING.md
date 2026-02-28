# Runbook — Brique 17 — Blackout & Holiday Pricing

## 1) Incident : Holiday created but not applied at checkout
- Vérifier le topic `eats.pricing.changed` via `kafka-consumer-groups`.
- Vérifier en DB : `SELECT * FROM eats_holidays WHERE id='...';`
- Vérifier les logs checkout: `computeEffectivePricing` doit être appelé avant le pricing final.
- Si nécessaire, republier : `node scripts/publish_holiday_change.js eats.pricing.changed '{"id":"<id>"}'`.

## 2) Incident : Orders accepted during blackout
- Vérifier l'API `effective-pricing` pour le datetime concerné.
- Vérifier timezone + métadonnées restaurant.
- Mitigation: passer `is_blackout=true` et remonter la priorité.

## 3) Maintenance
- Le cron `holiday-notifier` tourne tous les jours à 02:00 UTC.
- Valider les règles récurrentes en staging avant prod.

## Alerts
- `holiday-notifier` en échec > 3 runs => PagerDuty.
- p95 latence pricing > 500ms => scale service.
