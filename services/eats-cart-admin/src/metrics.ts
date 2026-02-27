import type { Express } from "express";
import client from "prom-client";

client.collectDefaultMetrics();

export const cartItemsAdded = new client.Counter({
  name: "eats_admin_cart_items_mutations_total",
  help: "Number of admin cart item mutations",
});

export function registerMetrics(app: Express) {
  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  });
}
