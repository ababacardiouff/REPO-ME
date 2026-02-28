# Runbook — Brique 15 — Eats Catalog

## Incidents fréquents

1. **Item creation blocked (content blocked)**
   - Vérifier les réponses FATIMA (`callFatimaModeration`) et les logs applicatifs.
   - Si faux positif: utiliser le workflow d'override manuel côté admin.

2. **Images non uploadées**
   - Vérifier `OBJECT_STORE_ENDPOINT`, `OBJECT_STORE_KEY`, `OBJECT_STORE_SECRET`.
   - Tester l'upload: `curl -F "file=@sample.jpg" http://<host>/api/uploads`.

3. **Migration DB échouée**
   - Vérifier le statut Prisma.
   - Exécuter: `psql $DATABASE_URL -f migrations/015_create_eats_catalog.sql`.

4. **Kafka events non publiés**
   - Vérifier `KAFKA_BROKERS`.
   - Redémarrer le pod et inspecter les topics `eats.item.*`.

## Monitoring

- `eats_catalog_item_creates_total`
- `eats_catalog_item_updates_total`
- `eats_catalog_item_deletes_total`

## Checklist pre-prod

- Vérifier unicité des slugs restaurants.
- Vérifier CORS/lifecycle object-store pour les images.
- Tester listing menu avec volume élevé (>=10k items).
- Vérifier RBAC (owner/admin).
