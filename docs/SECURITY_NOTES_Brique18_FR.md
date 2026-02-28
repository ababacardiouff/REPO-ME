# Sécurité — Brique 18

- Store FATIMA_KEY & DB creds as SealedSecrets / Vault.
- Rate-limit calls to FATIMA. Add exponential backoff.
- Audit every rule change: store userId, ip, diff in table `eats_surge_rule_audits`.
- JWT from Molam ID required for writes. Validate scopes & roles server-side.
- Monitor kafka producer errors and consumer lags; fail closed for pricing if downstream broken.
