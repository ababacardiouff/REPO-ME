import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092")
  .split(",")
  .map((b) => b.trim())
  .filter(Boolean);

export const kafka = new Kafka({
  clientId: "molam-eats-menu",
  brokers
});

export const kafkaProducer = kafka.producer();

export async function connectProducer() {
  await kafkaProducer.connect();
  console.log("Kafka producer connected");
}
