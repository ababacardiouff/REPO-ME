import app from "./app";
import { connectProducer } from "./infra/kafka";
import { dispatchOutbox } from "./workers/outbox";
import { startModerationWorker } from "./workers/moderationWorker";
import { startModerationWsBridge } from "./infra/wsBridge";

const port = Number(process.env.PORT || 3000);

export async function main() {
  const strictKafka = process.env.STRICT_KAFKA_STARTUP === "true";
  try {
    await connectProducer();
  } catch (err) {
    if (strictKafka) throw err;
    console.warn("Kafka unavailable at startup; continuing without producer", err);
  }

  if (process.env.ENABLE_MODERATION_WORKER === "true") {
    await startModerationWorker();
  }

  if (process.env.ENABLE_MODERATION_WS === "true") {
    await startModerationWsBridge();
  }
  setInterval(() => {
    void dispatchOutbox().catch((err) => {
      console.warn("Outbox dispatch skipped", err);
    });
  }, 5000);

  app.listen(port, () => {
    console.log(`Molam Eats Menu API listening on ${port}`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal startup error", err);
    process.exit(1);
  });
}

export default app;
