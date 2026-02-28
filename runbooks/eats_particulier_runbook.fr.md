# Runbook — Brique 14 — Compte Particulier Molam Eats

## Incidents courants

1) Activation échoue (`401 invalid_token`)
- Vérifier le secret `MOLAM_ID_JWT_SECRET` dans `eats-particulier-secrets`.
- Rejouer : `curl -X POST /accounts/activate -H "Authorization: Bearer <molam_jwt>"`.

2) DB connection failure
- Vérifier `DATABASE_URL` et l'état des pods : `kubectl -n molam get pods`.
- Vérifier les logs : `kubectl logs <pod>`.

3) FATIMA unreachable
- L'appel FATIMA est non bloquant.
- Inspecter les événements d'activation en base (table des events).
- Relancer le worker consommateur si nécessaire.

4) High activation error rate (>5/min)
- Alerte Prometheus, rollback du dernier déploiement ou scale des pods.
- Inspecter les claims JWT malformés.

## Checklist pré-prod
- Rotation des secrets JWT via KMS.
- Vérifier le mapping `doc_container_id` côté Molam ID.
- Valider les locales i18n (fr/en/wolof/ar).
- Test de charge 1k activations/min en staging.
