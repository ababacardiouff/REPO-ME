import { Router } from "express";
import { db } from "../../../infra/db";
import { requireRole } from "../../../middleware/rbac";

const router = Router();

router.get("/", requireRole(["ADMIN"]), async (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  const country = typeof req.query.country === "string" ? req.query.country : undefined;

  const agents = await db.any(
    `SELECT
      ea.id,
      ea.molam_id,
      ea.full_name,
      ea.email,
      ea.country_code,
      ea.language_code,
      ea.status,
      ea.fatima_score,
      COALESCE(json_agg(er.role_code) FILTER (WHERE er.role_code IS NOT NULL), '[]') AS roles
    FROM eats_agents ea
    LEFT JOIN eats_agent_roles ear ON ear.agent_id = ea.id
    LEFT JOIN eats_roles er ON er.id = ear.role_id
    WHERE ($1::text IS NULL OR er.role_code = $1)
      AND ($2::text IS NULL OR ea.country_code = $2)
    GROUP BY ea.id
    ORDER BY ea.created_at DESC`,
    [role || null, country || null]
  );

  res.json(agents);
});

router.post("/", requireRole(["ADMIN"]), async (req, res) => {
  const { molamId, fullName, email, countryCode, languageCode } = req.body;

  if (!molamId || !fullName || !email || !countryCode) {
    return res.status(400).json({ error: "missing required fields" });
  }

  const agent = await db.one(
    `INSERT INTO eats_agents (molam_id, full_name, email, country_code, language_code)
    VALUES ($1, $2, $3, $4, COALESCE($5, 'fr'))
    RETURNING id, molam_id, full_name, email, country_code, language_code, status, fatima_score`,
    [molamId, fullName, email, countryCode, languageCode || null]
  );

  res.status(201).json(agent);
});

router.get("/:id", requireRole(["ADMIN", "SUPPORT_CLIENT", "SUPPORT_VENDEUR"]), async (req, res) => {
  const agent = await db.oneOrNone(
    `SELECT
      ea.id,
      ea.molam_id,
      ea.full_name,
      ea.email,
      ea.country_code,
      ea.language_code,
      ea.status,
      ea.fatima_score,
      COALESCE(json_agg(er.role_code) FILTER (WHERE er.role_code IS NOT NULL), '[]') AS roles
    FROM eats_agents ea
    LEFT JOIN eats_agent_roles ear ON ear.agent_id = ea.id
    LEFT JOIN eats_roles er ON er.id = ear.role_id
    WHERE ea.id = $1
    GROUP BY ea.id`,
    [req.params.id]
  );

  if (!agent) {
    return res.status(404).json({ error: "agent not found" });
  }

  return res.json(agent);
});

router.patch("/:id", requireRole(["ADMIN"]), async (req, res) => {
  const { status, fatimaScore } = req.body as { status?: string; fatimaScore?: number };

  const updated = await db.oneOrNone(
    `UPDATE eats_agents
      SET status = COALESCE($2, status),
          fatima_score = COALESCE($3, fatima_score),
          updated_at = now()
     WHERE id = $1
     RETURNING id, status, fatima_score, updated_at`,
    [req.params.id, status || null, fatimaScore ?? null]
  );

  if (!updated) {
    return res.status(404).json({ error: "agent not found" });
  }

  return res.json(updated);
});

export default router;
