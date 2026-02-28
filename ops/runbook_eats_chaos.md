# Runbook — Eats Chaos & Resilience (FR)

## 1) PostgresHighP95 / CheckoutApiErrorRateHigh
- Vérifier CPU/RAM/I/O DB.
- Identifier les requêtes lentes.

## 2) KafkaHighConsumerLag
- Vérifier consumer group lag.
- Redémarrer les consumers si crash.

## 3) NotificationFailuresHigh
- Vérifier mailer / sms gateway.
- Basculer en mode dégradé si nécessaire.
