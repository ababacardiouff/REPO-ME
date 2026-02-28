import { Router } from "express";
import * as ctrl from "../controllers/holidayController";
import { requireMolamJwt, requireRole } from "../middleware/auth";

const router = Router();

router.get("/restaurants/:restId/holidays", ctrl.listForRestaurant);
router.post("/", requireMolamJwt, requireRole(["admin", "ops", "restaurant_owner"]), ctrl.createHoliday);
router.put("/:id", requireMolamJwt, requireRole(["admin", "ops", "restaurant_owner"]), ctrl.updateHoliday);
router.delete("/:id", requireMolamJwt, requireRole(["admin", "ops", "restaurant_owner"]), ctrl.deleteHoliday);
router.post("/restaurants/:restId/effective-pricing", ctrl.getEffectivePricing);

export default router;
