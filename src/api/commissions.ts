import { Router } from "express";
import { CommissionService, PgCommissionStore } from "../modules/commission/commission.service";

const router = Router();
const commissionService = new CommissionService(new PgCommissionStore());

router.post("/", async (req, res) => {
  const { orderId, vendorId, orderTotal } = req.body ?? {};

  if (!orderId || !vendorId || typeof orderTotal !== "number") {
    return res.status(400).json({ error: "orderId, vendorId and numeric orderTotal are required" });
  }

  try {
    const commission = await commissionService.recordCommission(orderId, vendorId, orderTotal);
    return res.status(201).json({
      ...commission,
      commissionAmount: commission.commissionAmount.toFixed(2),
      vendorEarning: commission.vendorEarning.toFixed(2)
    });
  } catch (error: any) {
    const message = error?.message ?? "internal_error";
    const status = message === "invalid_order_total" ? 400 : 500;
    return res.status(status).json({ error: message });
  }
});

router.get("/balance/:vendorId", async (req, res) => {
  const { vendorId } = req.params;

  try {
    const balance = await commissionService.getVendorBalance(vendorId);
    return res.json({ vendorId, balance: Number(balance.toFixed(2)) });
  } catch {
    return res.status(500).json({ error: "unable_to_fetch_balance" });
  }
});

export default router;
