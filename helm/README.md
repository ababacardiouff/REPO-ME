# Helm Ops Runbook — HPA Scaling (Molam Eats)

## 🎯 Objectif
Garantir que `eats-plans-service` s’adapte automatiquement à la charge (CPU, mémoire, RPS, latence), afin d’assurer disponibilité, performance et optimisation des coûts.

## 🔎 Étapes de diagnostic
1. Vérifier l’état du HPA
   ```bash
   kubectl get hpa -n molam-eats
   ```
2. Observer les Pods
   ```bash
   kubectl get pods -n molam-eats -l app=eats-plans-service -o wide
   kubectl top pods -n molam-eats
   ```
3. Vérifier les logs applicatifs
   ```bash
   kubectl logs -n molam-eats -l app=eats-plans-service --tail=100
   ```
4. Vérifier RPS et latence p95 dans Grafana (`http_requests_per_second`, `http_request_duration_seconds`).

## 🛠️ Actions correctives
- **Scaling ne déclenche pas**
  ```bash
  kubectl get deployment metrics-server -n kube-system
  ```
- **Scaling trop lent**: augmenter `hpa.maxReplicas` dans `helm/eats-plans/values.yaml`, puis:
  ```bash
  helm upgrade eats-plans ./helm/eats-plans -n molam-eats
  ```
- **Flapping**: ajouter `behavior.scaleDown.stabilizationWindowSeconds: 300` dans la ressource HPA.
- **Pods saturés**: augmenter `resources.limits` et `resources.requests`.

## 📊 Escalation Policy
1. Ops on-call (niveau 1)
2. SRE Senior (niveau 2)
3. Incident Manager si impact client > 10 min
4. Équipe Dev Eats si problème applicatif

## ✅ Check-list post-incident
- Vérifier le retour à `minReplicas`.
- Exporter un snapshot Prometheus.
- Rédiger un post-mortem (Confluence Ops Incidents).
