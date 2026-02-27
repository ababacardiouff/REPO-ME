import { kafkaProducer } from "./kafka";

let connected = false;

export async function connectProducer() {
  if (!connected) {
    await kafkaProducer.connect();
    connected = true;
  }
}

export async function send(topic: string, key: string, value: unknown) {
  await connectProducer();
  await kafkaProducer.send({
    topic,
    messages: [{ key, value: JSON.stringify(value) }]
  });
}
