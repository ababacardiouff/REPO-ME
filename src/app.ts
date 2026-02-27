import bodyParser from "body-parser";
import express from "express";
import categoriesRouter from "./api/eats/categories";
import itemsRouter from "./api/eats/items";
import metricsClient, { outboxLagGauge } from "./infra/metrics";
import { metricsMiddleware } from "./middleware/metricsMiddleware";
import db from "./db";

const app = express();
app.use(bodyParser.json());
app.use(metricsMiddleware);

app.use("/api/eats/categories", categoriesRouter);
app.use("/api/eats/items", itemsRouter);

app.get("/healthz", (_, res) => res.json({ status: "ok" }));

app.get("/metrics", async (_, res) => {
  try {
    const r = await db.query("SELECT count(*) FROM eats_outbox WHERE processed=false");
    outboxLagGauge.set(parseInt(r.rows[0].count, 10));
  } catch {
    // no-op
  }
  res.set("Content-Type", metricsClient.register.contentType);
  res.end(await metricsClient.register.metrics());
});

export default app;
