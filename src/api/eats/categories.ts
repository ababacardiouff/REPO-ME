import { Router } from "express";
import db from "../../db";

const router = Router();

router.post("/", async (req, res) => {
  const { vendorId, code, name, parentId, position, visible } = req.body;
  const result = await db.query(
    `INSERT INTO eats_menu_categories (vendor_id, code, name, parent_id, position, visible)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [vendorId, code, JSON.stringify(name), parentId || null, position || 0, visible ?? true]
  );
  res.json(result.rows[0]);
});

router.get("/", async (req, res) => {
  const vendorId = req.query.vendorId as string | undefined;
  const q = vendorId
    ? `SELECT * FROM eats_menu_categories WHERE vendor_id=$1 ORDER BY position`
    : `SELECT * FROM eats_menu_categories ORDER BY position`;
  const params = vendorId ? [vendorId] : [];
  const result = await db.query(q, params);
  res.json(result.rows);
});

export default router;
