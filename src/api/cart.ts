import { Router } from "express";
import db from "../db";
import { eatsProductAddToCartTotal } from "../infra/metrics";

const router = Router();

router.post("/add", async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  eatsProductAddToCartTotal.inc({ product_id: String(productId || "unknown") }, 1);
  await db.query(
    "INSERT INTO eats_product_events (product_id, event_type, meta) VALUES ($1,'add_to_cart',$2)",
    [productId, JSON.stringify({ quantity, channel: "web" })]
  );
  return res.json({ status: "ok" });
});

export default router;
