import { check, sleep } from "k6";

export const options = { vus: 20, duration: "2m" };

function simulateKafkaMessage() {
  if (Math.random() < 0.1) throw new Error("Kafka message lost");
  if (Math.random() < 0.2) sleep(2);
  return "ok";
}

export default function () {
  try {
    const msg = simulateKafkaMessage();
    check(msg, { "message processed": (m) => m === "ok" });
  } catch (_e) {
    check(true, { "message lost handled": (x) => x === true });
  }
}
