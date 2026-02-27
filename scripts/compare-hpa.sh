#!/bin/bash
set -e

echo "📊 Comparaison HPA Scaling Eats vs Shop vs Ads"

for metric in latency errors pods; do
  echo "➡️ Génération graphique $metric..."
  curl -s "http://prometheus.molam/api/v1/query_range?query=${metric}_eats&start=$(date -d '30m ago' +%s)&end=$(date +%s)&step=30" -o "tmp_${metric}_eats.json"
  curl -s "http://prometheus.molam/api/v1/query_range?query=${metric}_shop&start=$(date -d '30m ago' +%s)&end=$(date +%s)&step=30" -o "tmp_${metric}_shop.json"
  curl -s "http://prometheus.molam/api/v1/query_range?query=${metric}_ads&start=$(date -d '30m ago' +%s)&end=$(date +%s)&step=30" -o "tmp_${metric}_ads.json"
done

echo "✅ Données récupérées : tmp_latency_*.json, tmp_errors_*.json, tmp_pods_*.json"
