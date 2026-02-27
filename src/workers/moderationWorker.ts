import db from "../db";
import { kafka } from "../infra/kafka";
import { send } from "../infra/kafkaProducer";
import { callFatimaModeration } from "../services/FatimaModeration";
import { analyzeAndTransformImage } from "../services/imageProcessor";
import { detectContactInfo, sanitizeText } from "../services/textFilter";

const consumer = kafka.consumer({ groupId: "moderation-worker" });

export async function startModerationWorker() {
  await consumer.connect();
  await consumer.subscribe({ topic: "molam.moderation.requests" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse((message.value || Buffer.from("{}")).toString());
      const { requestId, content = {} } = payload;

      try {
        const contacts = detectContactInfo(content.text || "");
        if (contacts.length > 0) {
          const sanitized = sanitizeText(content.text || "");
          await db.query(
            "UPDATE moderation_requests SET status='SANITIZED', fatima_response=$1, updated_at=now() WHERE id=$2",
            [JSON.stringify({ reason: "REGEX_CONTACT", contacts, sanitized_text: sanitized }), requestId]
          );
          await db.query(
            "INSERT INTO moderation_logs (request_id, action, actor, details) VALUES($1,'REGEX_BLOCK','FILTER',$2)",
            [requestId, JSON.stringify({ contacts })]
          );

          await send("molam.moderation.responses", requestId, {
            requestId,
            action: "SANITIZE_TEXT",
            sanitized
          });
          return;
        }

        if (Array.isArray(content.images)) {
          content.meta = content.meta || {};
          content.meta.image_analysis = content.meta.image_analysis || [];
          for (const img of content.images) {
            try {
              const analysis = await analyzeAndTransformImage(img.url);
              content.meta.image_analysis.push({ url: img.url, analysis });
            } catch {
              // ignore per-image failure
            }
          }
        }

        const fatimaResp = await callFatimaModeration({
          text: content.text,
          images: content.images,
          meta: content.meta
        });

        await db.query("UPDATE moderation_requests SET fatima_response=$1, updated_at=now() WHERE id=$2", [
          JSON.stringify(fatimaResp),
          requestId
        ]);

        if (fatimaResp.verdict === "BLOCK") {
          await db.query("UPDATE moderation_requests SET status='BLOCKED' WHERE id=$1", [requestId]);
          await db.query(
            "INSERT INTO moderation_logs(request_id, action, actor, details) VALUES($1,'FATIMA_BLOCK','FATIMA',$2)",
            [requestId, JSON.stringify(fatimaResp)]
          );
          await send("molam.moderation.responses", requestId, {
            requestId,
            action: "BLOCK",
            reason: fatimaResp.reasons || []
          });
          return;
        }

        if (fatimaResp.verdict === "SANITIZE") {
          await db.query("UPDATE moderation_requests SET status='SANITIZED' WHERE id=$1", [requestId]);
          await db.query(
            "INSERT INTO moderation_logs(request_id, action, actor, details) VALUES($1,'FATIMA_SANITIZE','FATIMA',$2)",
            [requestId, JSON.stringify(fatimaResp)]
          );
          await send("molam.moderation.responses", requestId, {
            requestId,
            action: "SANITIZE",
            sanitized: fatimaResp.sanitized_text || null
          });
          return;
        }

        await db.query("UPDATE moderation_requests SET status='ALLOWED' WHERE id=$1", [requestId]);
        await db.query(
          "INSERT INTO moderation_logs(request_id, action, actor, details) VALUES($1,'FATIMA_ALLOW','FATIMA',$2)",
          [requestId, JSON.stringify(fatimaResp)]
        );
        await send("molam.moderation.responses", requestId, { requestId, action: "ALLOW" });
      } catch (err) {
        await db.query("UPDATE moderation_requests SET status='REVIEW' WHERE id=$1", [requestId]);
        await db.query(
          "INSERT INTO moderation_logs(request_id, action, actor, details) VALUES($1,'ERROR','SYSTEM',$2)",
          [requestId, JSON.stringify({ error: String(err) })]
        );
      }
    }
  });
}
