import k8s from "@kubernetes/client-node";
import fetch from "node-fetch";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApps = kc.makeApiClient(k8s.AppsV1Api);

const PROMETHEUS = process.env.PROMETHEUS_URL;
const LOOKAHEAD = parseInt(process.env.SCALE_LOOKAHEAD_MINUTES || "30", 10);
const MIN_REPLICAS = parseInt(process.env.MIN_REPLICAS || "2", 10);
const MAX_REPLICAS = parseInt(process.env.MAX_REPLICAS || "50", 10);

export async function fetchLatencyForecast(tenant) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 86400 * 7;
  const step = 3600;
  const query = `histogram_quantile(0.95, sum(rate(http_req_duration_bucket{tenant=\"${tenant}\"}[5m])) by (le))`;

  const res = await fetch(`${PROMETHEUS}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`);
  const data = await res.json();
  const values = data?.data?.result?.[0]?.values || [];

  if (values.length === 0) return 0;

  const stepsToInspect = Math.max(1, Math.ceil(LOOKAHEAD / 60));
  const lastValues = values.slice(-stepsToInspect);
  const avgForecast = lastValues
    .map((v) => parseFloat(v[1]))
    .reduce((a, b) => a + b, 0) / lastValues.length;

  return avgForecast;
}

async function scaleDeployment(tenant, ns, name) {
  const latency = await fetchLatencyForecast(tenant);
  let targetReplicas = MIN_REPLICAS;

  if (latency > 0.5) targetReplicas = Math.min(MAX_REPLICAS, MIN_REPLICAS + 10);
  if (latency > 1.0) targetReplicas = Math.min(MAX_REPLICAS, MIN_REPLICAS + 20);

  const res = await k8sApps.readNamespacedDeployment(name, ns);
  const currentReplicas = res.body.spec.replicas;

  if (currentReplicas !== targetReplicas) {
    console.log(`⚡ Scaling ${tenant} → ${targetReplicas} replicas (latency=${latency}s)`);
    await k8sApps.patchNamespacedDeploymentScale(
      name,
      ns,
      { spec: { replicas: targetReplicas } },
      undefined,
      undefined,
      undefined,
      undefined,
      { headers: { "Content-Type": "application/merge-patch+json" } }
    );
  }
}

async function main() {
  const tenants = [
    { tenant: "eats", ns: "molam-eats", name: "molam-eats-api" },
    { tenant: "shop", ns: "molam-shop", name: "molam-shop-api" },
    { tenant: "ads", ns: "molam-ads", name: "molam-ads-api" }
  ];

  for (const t of tenants) {
    await scaleDeployment(t.tenant, t.ns, t.name);
  }
}

setInterval(main, 5 * 60 * 1000);
main().catch((err) => {
  console.error("FATIMA autoscaler failed", err);
  process.exitCode = 1;
});
