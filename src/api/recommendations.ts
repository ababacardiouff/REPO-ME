import { Router } from "express";
import db from "../db";

const router = Router();

router.get("/:productId", async (req, res) => {
  const pid = req.params.productId;
  const p = (await db.query("SELECT category_id FROM eats_products WHERE id=$1", [pid])).rows[0];
  if (!p) {
    return res.json([]);
  }

  const r = await db.query(
    "SELECT id, sku_code, name, price_cents, currency, Fatima_score FROM eats_products WHERE category_id=$1 AND id<>$2 ORDER BY Fatima_score DESC LIMIT 8",
    [p.category_id, pid]
  );
  return res.json(r.rows);
});

export default router;
