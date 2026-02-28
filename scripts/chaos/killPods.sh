#!/bin/bash
set -e

PODS=$(kubectl get pods -l app=ab-testing -o name | head -n 2)
for POD in $PODS; do
  echo "Killing pod $POD..."
  kubectl delete "$POD" --force --grace-period=0
done
