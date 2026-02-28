import client from "prom-client";
import express from "express";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const refundRequests = new client.Counter({
  name: "refund_requests_total",
  help: "Total refund requests",
  registers: [register],
});

export const refundFailures = new client.Counter({
  name: "refund_failures_total",
  help: "Total refund failures",
  registers: [register],
});

export const refundDuration = new client.Histogram({
  name: "refund_duration_seconds",
  help: "Refund processing duration",
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export function setupMetrics(app: express.Express) {
  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
}
