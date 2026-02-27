import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.01"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const paymentMethods = ["molamPay", "stripe", "wave", "express"];

export default function () {
  const userId = `USER_${Math.floor(Math.random() * 100000)}`;
  const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  const payload = JSON.stringify({
    userId,
    items: [
      { name: "Pizza", price: 10, qty: 1 },
      { name: "Drink", price: 5, qty: 2 }
    ],
    paymentMethod: payment,
    deliveryAddressId: `ADDR_${Math.floor(Math.random() * 1000)}`
  });

  const res = http.post(`${BASE_URL}/api/checkout`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "payment success": (r) => r.body.includes("SUCCESS")
  });

  sleep(1);
}
