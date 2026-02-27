import { Router } from "express";
import db from "../db";

const router = Router();

router.get("/:productId", async (req, res) => {
  const r = await db.query("SELECT * FROM eats_product_variants WHERE product_id=$1", [req.params.productId]);
  return res.json(r.rows);
});

router.post("/", async (req, res) => {
  const p = req.body;
  const r = await db.query(
    "INSERT INTO eats_product_variants (product_id, variant_code, attributes, price_cents, stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [p.productId, p.variantCode, JSON.stringify(p.attributes || {}), p.priceCents || null, p.stock || 0]
  );

  await db.query(
    "INSERT INTO eats_outbox (aggregate_type, aggregate_id, event_type, payload) VALUES ('variant',$1,'created',$2)",
    [r.rows[0].id, JSON.stringify(r.rows[0])]
  );

  return res.status(201).json(r.rows[0]);
});

export default router;
