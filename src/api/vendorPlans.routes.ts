import express from "express";
import { molamAuth } from "../infra/auth";
import { getActiveSubscription, listPlans, subscribeVendor } from "../services/vendorPlans.service";

const router = express.Router();

router.get("/plans", molamAuth, async (_req, res) => {
  const plans = await listPlans();
  res.json(plans);
});

router.get("/subscription", molamAuth, async (req: any, res) => {
  const vendorId = req.user.id;
  const sub = await getActiveSubscription(vendorId);
  res.json(sub || { status: "NOT_SUBSCRIBED" });
});

router.post("/subscribe", molamAuth, async (req: any, res) => {
  const vendorId = req.user.id;
  const { planCode, paymentProvider, paymentSubscriptionId } = req.body;
  try {
    const sub = await subscribeVendor(vendorId, planCode, paymentProvider, paymentSubscriptionId);
    res.status(201).json(sub);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
