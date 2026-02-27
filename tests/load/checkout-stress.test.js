import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 1000 },
    { duration: "2m", target: 2500 },
    { duration: "2m", target: 5000 },
    { duration: "2m", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<1200"],
    http_req_failed: ["rate<0.02"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const paymentMethods = ["molamPay", "stripe", "wave", "express"];

export default function () {
  const userId = `USER_${Math.floor(Math.random() * 1000000)}`;
  const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  const payload = JSON.stringify({
    userId,
    items: [
      { name: "Burger", price: 8, qty: 1 },
      { name: "Fries", price: 3, qty: 1 }
    ],
    paymentMethod: payment,
    deliveryAddressId: `ADDR_${Math.floor(Math.random() * 1000)}`
  });

  const res = http.post(`${BASE_URL}/api/checkout`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "contains SUCCESS or QUEUED": (r) =>
      r.body.includes("SUCCESS") || r.body.includes("QUEUED")
  });

  sleep(0.5);
}
