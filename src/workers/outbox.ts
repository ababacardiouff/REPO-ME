import db from "../db";
import { kafkaProducer } from "../infra/kafka";

export async function dispatchOutbox() {
  const rows = (await db.query(`SELECT * FROM eats_outbox WHERE processed=false ORDER BY id LIMIT 100`)).rows;
  for (const r of rows) {
    try {
      await kafkaProducer.send({
        topic: `molam.eats.${r.event_type}`,
        messages: [{ key: r.aggregate_id, value: JSON.stringify(r.payload) }]
      });
      await db.query(`UPDATE eats_outbox SET processed=true WHERE id=$1`, [r.id]);
    } catch (err) {
      console.error("outbox dispatch failed", err);
    }
  }
}
