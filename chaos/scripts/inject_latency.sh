#!/usr/bin/env bash
set -euo pipefail

SERVICE=""
NAMESPACE="molam"
DELAY_MS=2000
DURATION=180

while [[ $# -gt 0 ]]; do
  case $1 in
    --service) SERVICE="$2"; shift 2 ;;
    --namespace) NAMESPACE="$2"; shift 2 ;;
    --delay) DELAY_MS="$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    *) echo "Unknown arg $1"; exit 2 ;;
  esac
done

if [[ -z "$SERVICE" ]]; then
  echo "Missing --service"; exit 2
fi

cat <<YAML > /tmp/istio-fault.yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ${SERVICE}-fault
  namespace: ${NAMESPACE}
spec:
  hosts:
  - "${SERVICE}"
  http:
  - fault:
      delay:
        fixedDelay: ${DELAY_MS}ms
        percentage:
          value: 100.0
    route:
    - destination:
        host: ${SERVICE}
YAML

kubectl apply -f /tmp/istio-fault.yaml
sleep "$DURATION"
kubectl delete -f /tmp/istio-fault.yaml || true
