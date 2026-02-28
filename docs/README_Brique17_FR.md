# Brique 17 — Blackout & Holiday Pricing — Guide rapide (FR)

## Déploiement local
1. Configurer `DATABASE_URL`, `KAFKA_BROKERS`, `MOLAM_ID_JWT_SECRET`.
2. `npm ci && npm run build`
3. `node dist/index.js`

## Seeds
`node -r ts-node/register scripts/seed_holidays.ts`

## Kafka topics
`KAFKA_BOOTSTRAP=localhost:9092 ./scripts/create_kafka_topics.sh`

## Tests
`npm test`
