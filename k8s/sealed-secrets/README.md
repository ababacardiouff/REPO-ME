# Sealed Secrets — Molam Eats Holiday

Ne pas commiter de secrets en clair.

```bash
./scripts/create_sealed_secret.sh molam eats-holiday-secret DATABASE_URL=... KAFKA_BROKERS=kafka:9092 MOLAM_ID_JWT_SECRET=...
kubectl apply -f sealed-secret.yaml
```
