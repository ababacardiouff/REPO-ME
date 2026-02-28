import client from "prom-client";

export const availabilityChecksTotal = new client.Counter({
  name: "eats_availability_checks_total",
  help: "Total availability checks"
});

export const availabilityCheckLatency = new client.Histogram({
  name: "eats_availability_check_latency_ms",
  help: "Latency ms",
  buckets: [10, 50, 100, 300, 1000]
});
