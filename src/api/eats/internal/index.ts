import { Router } from "express";
import { db } from "../../../infra/db";
import { requireRole } from "../../../middleware/rbac";
import agentsRouter from "./agents";

const router = Router();

router.use("/agents", agentsRouter);

router.get("/roles", requireRole(["ADMIN", "SUPPORT_CLIENT", "SUPPORT_VENDEUR"]), async (_req, res) => {
  const roles = await db.any("SELECT id, role_code, role_name, description FROM eats_roles ORDER BY role_code");
  res.json(roles);
});

router.get("/audit", requireRole(["ADMIN", "ANALYSTE"]), async (req, res) => {
  const limit = Number(req.query.limit || 100);
  const logs = await db.any(
    `SELECT id, agent_id, action, context, created_at
      FROM eats_agent_logs
      ORDER BY created_at DESC
      LIMIT $1`,
    [Number.isFinite(limit) ? Math.min(limit, 500) : 100]
  );
  res.json(logs);
});

export default router;
