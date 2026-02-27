import { NextFunction, Response } from "express";
import { incrementUsageIfAllowed } from "../services/vendorPlans.service";
import { AuthenticatedRequest } from "../infra/auth";

export async function quotaGuard(req: AuthenticatedRequest & { quota?: { remaining: number | null } }, res: Response, next: NextFunction) {
  try {
    const vendorId = (req.params.vendorId as string) || (req.body.vendorId as string) || req.user?.id;
    if (!vendorId) return res.status(400).json({ error: "missing_vendor_id" });

    const result = await incrementUsageIfAllowed(vendorId);
    if (!result.allowed) {
      return res.status(403).json({ error: "quota_exceeded", remaining: result.remaining });
    }
    req.quota = { remaining: result.remaining };
    return next();
  } catch (err: any) {
    if (err.message === "no-active-subscription") return res.status(403).json({ error: "no_active_subscription" });
    return res.status(500).json({ error: err.message || "quota_check_error" });
  }
}
