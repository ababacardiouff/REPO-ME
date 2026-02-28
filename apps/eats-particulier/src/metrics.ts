import client from "prom-client";
import express from "express";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const activationsCounter = new client.Counter({
  name: "eats_particulier_activations_total",
  help: "Total molam eats particulier activations",
  registers: [register]
});

export const activeUsersGauge = new client.Gauge({
  name: "eats_particulier_active_users",
  help: "Active eats particulier users",
  registers: [register]
});

export function setupMetrics(app: express.Express) {
  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
}
