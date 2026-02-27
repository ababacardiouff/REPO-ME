import { Router } from "express";
import db from "../db";
import { verifyMolamID, requireRoles } from "../middleware/molamIdAuth";
import { send } from "../infra/kafkaProducer";

const router = Router();

router.use(verifyMolamID);
router.use(requireRoles(["MODERATOR", "OPS_ADMIN"]));

router.get("/requests", async (req, res) => {
  const { status, source, limit = 50, offset = 0 } = req.query;
  const q = `SELECT id, source, source_id, content, status, created_at FROM moderation_requests
             WHERE ($1::text IS NULL OR status=$1) AND ($2::text IS NULL OR source=$2)
             ORDER BY created_at DESC LIMIT $3 OFFSET $4`;
  const r = await db.query(q, [status || null, source || null, Number(limit), Number(offset)]);
  res.json(r.rows);
});

router.get("/requests/:id", async (req, res) => {
  const r = await db.query("SELECT * FROM moderation_requests WHERE id=$1", [req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: "not_found" });
  res.json(r.rows[0]);
});

router.post("/requests/:id/override", async (req, res) => {
  const { action, note, sanitizedText } = req.body;
  const id = req.params.id;
  if (!["ALLOW", "BLOCK", "SANITIZE"].includes(action)) {
    return res.status(400).json({ error: "invalid_action" });
  }

  const status = action === "ALLOW" ? "ALLOWED" : action === "BLOCK" ? "BLOCKED" : "SANITIZED";
  await db.query(
    "UPDATE moderation_requests SET status=$1, updated_at=now(), fatima_response=$2 WHERE id=$3",
    [status, JSON.stringify({ adminOverride: true, note, sanitizedText }), id]
  );
  await db.query(
    "INSERT INTO moderation_logs(request_id, action, actor, details) VALUES($1,$2,'ADMIN',$3)",
    [id, `ADMIN_${action}`, JSON.stringify({ note, by: (req as any).user?.id })]
  );

  await send("molam.moderation.responses", id, { requestId: id, action, note, sanitizedText });
  res.json({ status: "ok" });
});

export default router;
