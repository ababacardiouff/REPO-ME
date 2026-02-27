import { kafka } from "./kafka";

export async function startModerationWsBridge() {
  const consumer = kafka.consumer({ groupId: "moderation-ws" });
  await consumer.connect();
  await consumer.subscribe({ topic: "molam.moderation.responses" });
  await consumer.run({
    eachMessage: async () => {
      // Websocket bridge intentionally stubbed for environments without ws runtime dependency.
    }
  });
}
