#!/usr/bin/env bash
set -euo pipefail

NAMESPACE=${1:-}
SECRET_NAME=${2:-}
shift 2 || true

if [[ -z "$NAMESPACE" || -z "$SECRET_NAME" || $# -eq 0 ]]; then
  echo "Usage: $0 <namespace> <secret-name> <key>=<value> ..."
  exit 1
fi

args=()
for kv in "$@"; do
  args+=(--from-literal="$kv")
done

kubectl create secret generic "$SECRET_NAME" -n "$NAMESPACE" "${args[@]}" --dry-run=client -o yaml > secret.yaml
kubeseal --controller-namespace kube-system --controller-name sealed-secrets-controller -o yaml < secret.yaml > sealed-secret.yaml
rm secret.yaml

echo "✅ Sealed secret written to sealed-secret.yaml"
