# Brique 1 — Accounts & Onboarding (Molam Eats)

## Portée
Cette brique implémente l'onboarding vendeurs Eats avec synchronisation des justificatifs depuis Molam ID, scoring FATIMA, endpoints API, workers Kafka, chart Helm, CI et tests.

## Composants
- **Migrations**: création des tables vendeurs, documents, rôles.
- **API**: onboarding (`register`, `activate`, `status`) et documents (`upload`, `list`).
- **Services**: logique métier, bridge Molam ID, client FATIMA.
- **Infra**: DB Postgres, Kafka, middleware auth JWT, logger.
- **Workers**: consommation d'événements onboarding et vérification documentaire.
- **Frontend**: écran d'inscription + onglets de documents + progression activation.
- **Ops**: chart Helm, workflow CI, runbook.

## Exécution locale
1. `npm ci`
2. `npm run build`
3. `npm test`
4. `npm run dev`

## Variables d'environnement
- `DATABASE_URL`
- `KAFKA_BROKERS`
- `FATIMA_URL`
- `FATIMA_KEY`
- `MOLAM_ID_URL`
- `MOLAM_ID_TOKEN`
- `JWT_PUBLIC_KEY`
