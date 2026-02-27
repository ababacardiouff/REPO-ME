#!/bin/bash
set -e

NAMESPACE="molam-eats"
DEPLOY="eats-plans-service"

echo "📊 Vérification du scaling HPA..."
kubectl get hpa eats-plans-hpa -n "$NAMESPACE"

echo "🔎 Comptage des pods..."
REPLICAS=$(kubectl get deploy "$DEPLOY" -n "$NAMESPACE" -o jsonpath='{.status.replicas}')
READY=$(kubectl get deploy "$DEPLOY" -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}')

echo "➡️  Total pods: $REPLICAS / Ready: $READY"

if [ "$READY" -lt 3 ]; then
  echo "❌ Scaling insuffisant !"
  exit 1
else
  echo "✅ Scaling effectif avec $READY pods"
fi
