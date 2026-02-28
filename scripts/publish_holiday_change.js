const { Kafka } = require("kafkajs");

const broker = process.env.KAFKA_BROKERS || "localhost:9092";
const kafka = new Kafka({ brokers: broker.split(",") });
const producer = kafka.producer();

(async () => {
  const topic = process.argv[2];
  const payload = process.argv[3] ? JSON.parse(process.argv[3]) : { ts: new Date().toISOString() };
  if (!topic) {
    console.error("usage: node scripts/publish_holiday_change.js <topic> [jsonPayload]");
    process.exit(2);
  }

  await producer.connect();
  await producer.send({ topic, messages: [{ value: JSON.stringify(payload) }] });
  await producer.disconnect();
  console.log("published", topic);
})();
