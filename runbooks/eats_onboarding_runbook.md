# Runbook — Molam Eats Onboarding

## Contexte
Ce service gère l'ouverture des comptes vendeurs **Molam Eats** (restaurateurs, livreurs, pros).
Il s'appuie sur **Molam ID** pour l'identité, **FATIMA** pour le scoring, et expose une API REST + workers Kafka.

## 1. Déploiement
- Helm chart : `helm/eats`
- Secrets requis : `DATABASE_URL`, `KAFKA_BROKERS`, `FATIMA_URL`, `FATIMA_KEY`, `MOLAM_ID_URL`, `MOLAM_ID_TOKEN`
- Commande : `helm upgrade --install eats-onboarding helm/eats -n eats`

## 2. Monitoring
- Metrics cibles : `eats_vendor_registered_total`, `eats_vendor_docs_uploaded_total`, `eats_vendor_activated_total`
- Logs : INFO (succès), WARN (docs manquants), ERROR (Kafka/DB)
- Traces : API -> Service -> DB -> Kafka

## 3. Procédures incidents
- API en erreur 500 : vérifier DB et Kafka.
- Docs non validés : relancer `eats-docs-worker`.
- Activation bloquée : `UPDATE eats_vendors SET status='VERIFIED' WHERE id='<vendor-id>';`

## 4. Sécurité
- Authentification JWT via Molam ID.
- Données sensibles chiffrées au repos.
- RBAC appliqué côté backend.

## 5. Checklist Ops
- Vérifier 2 pods `eats-onboarding` actifs.
- Vérifier le topic Kafka `molam.eats.onboarding`.
- Vérifier dashboard Grafana Onboarding.
- Export hebdo `eats_vendor_documents` pour compliance.
