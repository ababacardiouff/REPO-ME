import bodyParser from "body-parser";
import express from "express";
import recommendationsRouter from "./api/recommendations";
import cartRouter from "./api/cart";
import checkoutRouter from "./api/checkout";
import productsRouter from "./api/products";
import variantsRouter from "./api/variants";
import categoriesRouter from "./api/eats/categories";
import itemsRouter from "./api/eats/items";
import metricsClient, { outboxLagGauge } from "./infra/metrics";
import moderationRouter from "./api/moderation";
import adminModerationRouter from "./api/adminModeration";
import { metricsMiddleware } from "./middlewares/metricsMiddleware";
import db from "./db";

const app = express();
app.use(bodyParser.json());
app.use(metricsMiddleware);

app.use("/api/eats/categories", categoriesRouter);
app.use("/api/eats/items", itemsRouter);
app.use("/api/eats/products", productsRouter);
app.use("/api/eats/variants", variantsRouter);
app.use("/api/eats/recommendations", recommendationsRouter);
app.use("/api/eats/cart", cartRouter);
app.use("/api/eats/checkout", checkoutRouter);
app.use("/api/moderation", moderationRouter);
app.use("/api/admin/moderation", adminModerationRouter);

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
