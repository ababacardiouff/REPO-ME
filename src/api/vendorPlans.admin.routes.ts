import express from "express";
import { molamAuth, requireAdmin } from "../infra/auth";
import { db } from "../infra/db";

const router = express.Router();
router.use(molamAuth, requireAdmin);

router.post("/force-change", async (req: any, res) => {
  const { vendorId, planCode } = req.body;
  try {
    await db.none("UPDATE eats_vendor_subscriptions SET plan_code=$1, updated_at=now() WHERE vendor_id=$2 AND status='ACTIVE'", [planCode, vendorId]);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/set-status", async (req: any, res) => {
  const { vendorId, status } = req.body;
  try {
    await db.none("UPDATE eats_vendor_subscriptions SET status=$1, updated_at=now() WHERE vendor_id=$2", [status, vendorId]);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
