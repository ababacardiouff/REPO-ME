#!/bin/bash
set -e

GRAFANA_URL="https://grafana.molam"
API_KEY=${GRAFANA_API_KEY}
DASHBOARD_UID="molam-multi-hpa"

mkdir -p reports

for tenant in eats shop ads; do
  START=$(date -d '15 minutes ago' +%s000)
  END=$(date +%s000)

  echo "📊 Génération du rapport PDF pour $tenant..."
  curl -s -H "Authorization: Bearer $API_KEY" \
    "$GRAFANA_URL/api/reports/render/pdf/$DASHBOARD_UID?from=$START&to=$END&var-tenant=$tenant" \
    --output "reports/hpa-${tenant}-report.pdf"
done

echo "✅ Rapports générés : reports/hpa-eats-report.pdf, reports/hpa-shop-report.pdf, reports/hpa-ads-report.pdf"
