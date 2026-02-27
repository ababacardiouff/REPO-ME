import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: (process.env.KAFKA_BROKERS || "kafka:9092").split(",") });
const producer = kafka.producer();

let connected = false;

export async function emitAdminAudit(payload: unknown) {
  if (!connected) {
    await producer.connect();
    connected = true;
  }

  await producer.send({
    topic: "molam.admin.audit",
    messages: [{ key: (payload as { agentId: string }).agentId, value: JSON.stringify(payload) }],
  });
}
