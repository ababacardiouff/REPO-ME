import client from "prom-client";

export const holidayChecksTotal = new client.Counter({
  name: "eats_holiday_checks_total",
  help: "Total holiday pricing checks"
});

export const holidayCheckLatency = new client.Histogram({
  name: "eats_holiday_check_latency_ms",
  help: "Holiday pricing check latency in milliseconds",
  buckets: [5, 20, 50, 100, 300, 500, 1000]
});
