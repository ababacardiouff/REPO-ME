import express from "express";
import { db } from "../../infra/db";

const router = express.Router();

router.post("/molam-pay", express.json(), async (req, res) => {
  const ev = req.body as { type?: string; data?: { subscription_id?: string } };

  try {
    if (ev.type === "invoice.payment_failed") {
      await db.none("UPDATE eats_vendor_subscriptions SET status='PAST_DUE' WHERE payment_subscription_id=$1", [ev.data?.subscription_id]);
    } else if (ev.type === "invoice.paid") {
      const nextEnd = new Date();
      nextEnd.setMonth(nextEnd.getMonth() + 1);
      await db.none(
        "UPDATE eats_vendor_subscriptions SET status='ACTIVE', current_period_end=$1, updated_at=now() WHERE payment_subscription_id=$2",
        [nextEnd.toISOString(), ev.data?.subscription_id]
      );
    }
  } catch (err: any) {
    return res.status(500).json({ ok: false, err: err.message });
  }

  return res.json({ ok: true });
});

export default router;
