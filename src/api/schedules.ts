import { Router } from "express";
import * as ctrl from "../controllers/scheduleController";
import { requireMolamJwt, requireRole } from "../middleware/auth";

const router = Router();

router.get("/restaurants/:restId/schedule", ctrl.getSchedule);
router.post("/restaurants/:restId/schedule", requireMolamJwt, requireRole(["restaurant_owner", "admin", "ops"]), ctrl.createOrUpdateSchedule);

router.post("/schedules/:scheduleId/weekly", requireMolamJwt, requireRole(["restaurant_owner", "admin", "ops"]), ctrl.createWeeklyRule);
router.put("/weekly/:id", requireMolamJwt, requireRole(["restaurant_owner", "admin", "ops"]), ctrl.updateWeeklyRule);
router.delete("/weekly/:id", requireMolamJwt, requireRole(["restaurant_owner", "admin", "ops"]), ctrl.deleteWeeklyRule);

router.post("/schedules/:scheduleId/exceptions", requireMolamJwt, requireRole(["restaurant_owner", "admin", "ops"]), ctrl.createException);
router.delete("/exceptions/:id", requireMolamJwt, requireRole(["restaurant_owner", "admin", "ops"]), ctrl.deleteException);

router.post("/restaurants/:restId/check-availability", ctrl.checkAvailability);

export default router;
