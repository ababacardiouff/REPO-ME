import { Router } from "express";
import { createCheckout } from "../controllers/checkoutController";

const router = Router();

router.post("/", createCheckout);
router.post("/express", (req, res, next) => {
  req.body.paymentMethod = "express";
  next();
}, createCheckout);

export default router;
