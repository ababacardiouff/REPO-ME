import { Router } from "express";
import * as ctrl from "../controllers/surgeController";
import { requireMolamJwt, requireRole } from "../middleware/auth";

const router = Router();

router.get("/restaurants/:restId/rules", ctrl.listForRestaurant);
router.post("/restaurants/:restId/evaluate", ctrl.evaluateForRestaurant);

router.post("/", requireMolamJwt, requireRole(["admin", "ops", "restaurant_owner"]), ctrl.createRule);
router.put("/:id", requireMolamJwt, requireRole(["admin", "ops", "restaurant_owner"]), ctrl.updateRule);
router.delete("/:id", requireMolamJwt, requireRole(["admin", "ops", "restaurant_owner"]), ctrl.deleteRule);

export default router;
