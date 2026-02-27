import { Router } from "express";
import db from "../db";
import { enrichProductWithFatima } from "../services/Fatima";

const router = Router();


router.get("/:id/variants", async (req, res) => {
  const r = await db.query("SELECT * FROM eats_product_variants WHERE product_id=$1", [req.params.id]);
  return res.json(r.rows);
});

router.get("/:id/recommendations", async (req, res) => {
  const p = (await db.query("SELECT category_id FROM eats_products WHERE id=$1", [req.params.id])).rows[0];
  if (!p) {
    return res.json([]);
  }
  const r = await db.query(
    "SELECT id, sku_code, name, price_cents, currency, Fatima_score FROM eats_products WHERE category_id=$1 AND id<>$2 ORDER BY Fatima_score DESC LIMIT 8",
    [p.category_id, req.params.id]
  );
  return res.json(r.rows);
});

router.post("/:id/reviews", async (req, res) => {
  const { rating, comment } = req.body;
  await db.query(
    "INSERT INTO eats_product_events (product_id, event_type, meta) VALUES ($1,'review',$2)",
    [req.params.id, JSON.stringify({ rating, comment })]
  );
  return res.status(201).json({ status: "ok" });
});

router.get("/:id", async (req, res) => {
  const r = await db.query("SELECT * FROM eats_products WHERE id=$1", [req.params.id]);
  const product = r.rows[0];
  if (!product) {
    return res.status(404).json({ error: "not_found" });
  }

  await db.query(
    "INSERT INTO eats_product_events (product_id, event_type, meta) VALUES ($1,'view',$2)",
    [product.id, JSON.stringify({ channel: "web" })]
  );

  return res.json(product);
});

router.get("/", async (req, res) => {
  const { vendorId, categoryId } = req.query;
  const q = `SELECT * FROM eats_products
    WHERE ($1::uuid IS NULL OR vendor_id=$1)
      AND ($2::uuid IS NULL OR category_id=$2)
    ORDER BY created_at DESC
    LIMIT 100`;
  const r = await db.query(q, [vendorId || null, categoryId || null]);
  return res.json(r.rows);
});

router.post("/", async (req, res) => {
  const p = req.body;
  const q = `INSERT INTO eats_products
    (vendor_id, sku_code, name, description, images, category_id, price_cents, currency, country, stock, is_available)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`;
  const vals = [
    p.vendorId,
    p.skuCode,
    JSON.stringify(p.name),
    JSON.stringify(p.description || {}),
    JSON.stringify(p.images || []),
    p.categoryId || null,
    p.priceCents,
    p.currency,
    p.country || "SN",
    p.stock || 0,
    p.isAvailable !== false
  ];

  const r = await db.query(q, vals);
  const created = r.rows[0];
  enrichProductWithFatima(created).catch(() => undefined);
  await db.query(
    "INSERT INTO eats_outbox (aggregate_type, aggregate_id, event_type, payload) VALUES ('product',$1,'created',$2)",
    [created.id, JSON.stringify(created)]
  );
  return res.status(201).json(created);
});

export default router;
