#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="molam"
LABEL="app=eats-checkout"
DURATION=120

while [[ $# -gt 0 ]]; do
  case $1 in
    --namespace) NAMESPACE="$2"; shift 2 ;;
    --label) LABEL="$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    *) echo "Unknown arg $1"; exit 2 ;;
  esac
done

POLICY_NAME="deny-egress-chaos-$(date +%s)"
cat <<YAML > /tmp/${POLICY_NAME}.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ${POLICY_NAME}
  namespace: ${NAMESPACE}
spec:
  podSelector:
    matchLabels:
      ${LABEL%%=*}: "${LABEL#*=}"
  policyTypes:
  - Egress
  egress: []
YAML

kubectl apply -f /tmp/${POLICY_NAME}.yaml
sleep "$DURATION"
kubectl delete -f /tmp/${POLICY_NAME}.yaml
