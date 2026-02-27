# Runbook — Brique 2 : Vendor Plans (Molam Eats)

## Objectif
Gérer les plans vendeurs : activation rapide, quotas articles, renouvellement.

## Déploiement
- Helm chart: helm/eats-plans
- Secrets requis: DATABASE_URL, MOLAM_ID_JWKS, MOLAM_PAY_SECRET

## Opérations quotidiennes
- Vérifier cron worker `subscriptionRenewalWorker` (logs).
- Vérifier métriques:
  - eats_subscriptions_active_total
  - eats_quota_exceeded_total
- Recalculer quotas: `SELECT * FROM eats_articles_usage WHERE vendor_id='...';`.

## Incidents courants
- **Quota bloqué mais plan OK**:
  - Vérifier `eats_articles_usage` pour la période.
  - Reset compteur si erreur: `UPDATE eats_articles_usage SET used_articles=0 WHERE vendor_id='...' AND period_year=YYYY AND period_month=MM;`
- **Paiement non reçu**:
  - Vérifier webhook logs Molam Pay.
  - Si besoin: set subscription PAST_DUE: `UPDATE eats_vendor_subscriptions SET status='PAST_DUE' WHERE id='...';`

## Support
- Agents internes (RBAC) peuvent forcer upgrade/downgrade via admin API.
