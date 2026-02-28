# Runbook — Invoices (Brique 12) — FR

## Incident : PDF generation failed (status=FAILED)
1. Vérifier logs du pod `molam-invoices` : `kubectl -n molam logs deploy/molam-invoices`.
2. Vérifier outbox / job queue : `SELECT * FROM invoices WHERE status='FAILED'`.
3. Rejouer : `node scripts/retryInvoice.js --invoice-id=<id>`.

## Incident : S3 upload error
1. Vérifier credentials / endpoint.
2. Test upload local : `aws s3api put-object --bucket $INVOICES_BUCKET --key test --body /dev/null --endpoint-url $S3_ENDPOINT`.

## Incident : Mail failed / MAILER unreachable
1. Vérifier mailer service health.
2. Switch to degraded mode : set feature flag `disable_email=true` via Ops UI.
3. Requeue sends when mailer back.

## Security
- PDF presigned URLs short TTL (<=7 days). Require Molam ID for direct API download.
- Never include raw PII in logs.

## Ops commands
- Retry generation : `node dist/workers/invoiceWorker.js retry <invoice-id>`
- Force resend email : `curl -X POST -H "Authorization: Bearer $TOKEN" $API/invoices/<id>/resend`
