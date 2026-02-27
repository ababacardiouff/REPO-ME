#!/bin/bash
set -e

GRAFANA_URL="https://grafana.molam"
DASHBOARD_UID="eats-hpa"
API_KEY=${GRAFANA_API_KEY}

START=$(date -d '15 minutes ago' +%s000)
END=$(date +%s000)

mkdir -p reports

echo "📊 Génération du rapport PDF..."
curl -s -H "Authorization: Bearer $API_KEY" \
  "$GRAFANA_URL/api/reports/render/pdf/$DASHBOARD_UID?from=$START&to=$END" \
  --output reports/hpa-scaling-report.pdf

echo "✅ Rapport exporté dans reports/hpa-scaling-report.pdf"
