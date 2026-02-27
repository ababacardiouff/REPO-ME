import { db } from "../infra/db";
import { kafka } from "../infra/kafka";
import { error, info } from "../infra/logger";

const consumer = kafka.consumer({ groupId: "eats-docs-worker" });

export async function startDocumentWorker() {
  await consumer.connect();
  await consumer.subscribe({ topic: "molam.eats.docs", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value!.toString());
        info("verify doc", payload.docId);
        await db.none("UPDATE eats_vendor_documents SET status='VERIFIED' WHERE id = $1", [payload.docId]);
      } catch (err) {
        error("docs worker error", err);
      }
    }
  });
}
