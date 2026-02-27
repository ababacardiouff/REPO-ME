#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="molam"
DEPLOYMENT=""
DURATION=300

while [[ $# -gt 0 ]]; do
  case $1 in
    --namespace) NAMESPACE="$2"; shift 2 ;;
    --deployment) DEPLOYMENT="$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    -h|--help) echo "Usage: $0 --namespace <ns> --deployment <name> --duration <seconds>"; exit 0 ;;
    *) echo "Unknown arg $1"; exit 2 ;;
  esac
done

if [[ -z "$DEPLOYMENT" ]]; then
  echo "Missing --deployment"
  exit 2
fi

kubectl -n "$NAMESPACE" scale deployment "$DEPLOYMENT" --replicas=0
sleep "$DURATION"
kubectl -n "$NAMESPACE" scale deployment "$DEPLOYMENT" --replicas=1
