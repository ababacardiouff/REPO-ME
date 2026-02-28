import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: (process.env.KAFKA_BROKERS || "kafka:9092").split(",") });
const producer = kafka.producer();
let connected = false;

export async function publishEvent(topic: string, payload: Record<string, unknown>) {
  if (!connected) {
    await producer.connect();
    connected = true;
  }

  await producer.send({
    topic,
    messages: [{ key: String(payload.restaurantId || payload.itemId || ""), value: JSON.stringify(payload) }]
  });
}
