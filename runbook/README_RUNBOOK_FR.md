# Runbook — Brique 6 : Moderation & Image Pipeline (FR)

## Objectif
Gérer incidents modération, indisponibilité FATIMA, backlog Kafka et faux positifs.

## Procédures rapides

### 1) Vérifier backlog modération
- SQL: `SELECT count(*) FROM moderation_requests WHERE status='PENDING';`
- Si > 500, vérifier le lag consumer:
  `kafka-consumer-groups --bootstrap-server ... --describe --group moderation-worker`

### 2) FATIMA inaccessible
- Vérifier health: `curl $FATIMA_URL/health -H "x-api-key:$FATIMA_KEY"`
- Si down, basculer en mode conservateur (`FATIMA_MODE=queue-only`) et routage en review manuel.

### 3) Fausse suppression signalée
- Rechercher les `moderation_logs` par `request_id`.
- Si action == `REGEX_BLOCK`, ouvrir la requête dans l’admin puis override (`ALLOW` ou `SANITIZE`).
- Documenter l’action dans la note d’audit.

## Escalade
- Backlog outbox > 10k: alerter l’équipe infra Kafka.
- Erreurs FATIMA répétées: alerter l’équipe FATIMA.
- Hausse des faux positifs: alerter OPS + support vendeur.
