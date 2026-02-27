import express from "express";
import { authMiddleware, AuthenticatedRequest } from "../../infra/auth";
import { activateVendor, createVendor, getVendorStatus } from "../../services/eatsVendorService";

const router = express.Router();

router.post("/register", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const vendor = await createVendor(req.user!.id, req.body);
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/:vendorId/activate", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await activateVendor(req.params.vendorId, req.user!.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:vendorId/status", authMiddleware, async (req, res) => {
  const status = await getVendorStatus(req.params.vendorId);
  res.json(status || { status: "NOT_FOUND" });
});

export default router;
