import client from "prom-client";

export const surgeEvaluationsTotal = new client.Counter({
  name: "eats_surge_evaluations_total",
  help: "Total surge evaluations"
});

export const surgeEvaluationLatency = new client.Histogram({
  name: "eats_surge_evaluation_latency_ms",
  help: "Surge evaluation latency in milliseconds",
  buckets: [10, 25, 50, 100, 200, 500, 1000, 2000]
});
