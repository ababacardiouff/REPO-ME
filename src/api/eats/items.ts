import { Router } from "express";
import db from "../../db";
import { menuCreates } from "../../infra/metrics";

const router = Router();

router.post("/", async (req, res) => {
  const p = req.body;
  const result = await db.query(
    `INSERT INTO eats_menu_items (vendor_id, category_id, sku_code, name, description, default_price_cents, currency, images, availability, status)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      p.vendorId,
      p.categoryId || null,
      p.skuCode,
      JSON.stringify(p.name),
      JSON.stringify(p.description || {}),
      p.defaultPriceCents,
      p.currency,
      JSON.stringify(p.images || []),
      JSON.stringify(p.availability || {}),
      p.status || "draft"
    ]
  );
  const item = result.rows[0];
  await db.query(
    `INSERT INTO eats_outbox (aggregate_type, aggregate_id, event_type, payload) VALUES('menu_item', $1, 'created', $2)`,
    [item.id, JSON.stringify(item)]
  );
  menuCreates.inc({ vendor_id: p.vendorId || "unknown", country: p.country || "unknown" }, 1);
  res.json(item);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const item = (await db.query(`SELECT * FROM eats_menu_items WHERE id=$1`, [id])).rows[0];
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  return res.json(item);
});

export default router;
