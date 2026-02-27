import { Kafka } from "kafkajs";

const kafkaBrokers = (process.env.KAFKA_BROKERS || "").split(",").filter(Boolean);
export const kafka = new Kafka({ brokers: kafkaBrokers.length ? kafkaBrokers : ["localhost:9092"] });

export async function emitUpsellEvent(event: Record<string, unknown>) {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "molam.upsell.events",
    messages: [{ key: (event.userId as string) || "anon", value: JSON.stringify(event) }],
  });
  await producer.disconnect();
}
