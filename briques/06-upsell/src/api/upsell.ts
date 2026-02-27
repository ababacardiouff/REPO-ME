import express from "express";
import jwt from "express-jwt";
import { UpsellService } from "../services/upsellService";

const router = express.Router();
const upsellService = new UpsellService();

const auth = jwt({
  secret: process.env.MOLAM_ID_JWKS || "fake-jwk",
  algorithms: ["RS256"],
  credentialsRequired: false,
});

router.use(auth);

router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = (req as any).user?.sub || null;
    const locale = (req.query.locale as string) || "fr";
    const currency = (req.query.currency as string) || "XOF";

    const result = await upsellService.getUpsellForProduct(productId, userId, locale, currency);
    res.json({ ok: true, data: result });
  } catch (error) {
    console.error("upsell error", error);
    res.status(500).json({ ok: false, error: "internal_error" });
  }
});

router.post("/:productId/accept", async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = (req as any).user?.sub || null;
    await upsellService.audit("ACCEPTED", productId, userId, req.body, req.body?.source || "UI");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "internal_error" });
  }
});

export default router;
