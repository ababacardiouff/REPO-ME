import { Router } from "express";
import db from "../db";
import { send } from "../infra/kafkaProducer";

const router = Router();

router.post("/requests", async (req, res) => {
  const { source, sourceId, content } = req.body;
  const r = await db.query(
    "INSERT INTO moderation_requests(source, source_id, content) VALUES($1,$2,$3) RETURNING id",
    [source, sourceId || null, content]
  );

  const requestId = r.rows[0].id;
  await send("molam.moderation.requests", requestId, { requestId, source, sourceId, content });
  res.json({ requestId, status: "PENDING" });
});

router.get("/requests/:id", async (req, res) => {
  const r = await db.query("SELECT * FROM moderation_requests WHERE id=$1", [req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: "not_found" });
  res.json(r.rows[0]);
});

export default router;
