#!/bin/bash
set -e

echo "📊 Génération Heatmap Latence P95 Eats / Shop / Ads"

START=$(date -d '7 days ago' +%s)
END=$(date +%s)

for tenant in eats shop ads; do
  echo "➡️ Export métriques latence pour $tenant"
  curl -s "http://prometheus.molam/api/v1/query_range?query=histogram_quantile(0.95,sum(rate(http_req_duration_bucket{tenant=\"$tenant\"}[5m])) by (le))&start=$START&end=$END&step=3600" \
    -o "heatmap_${tenant}.json"
done

echo "✅ Heatmap data générée : heatmap_eats.json, heatmap_shop.json, heatmap_ads.json"
