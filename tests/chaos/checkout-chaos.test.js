import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 300,
  duration: "2m",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1500"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
const chaosMode = __ENV.CHAOS_MODE || "normal";

export default function () {
  const userId = `CHAOS_${Math.floor(Math.random() * 100000)}`;
  const payment =
    chaosMode === "molamPayDown"
      ? "molamPay"
      : chaosMode === "stripeDown"
        ? "stripe"
        : ["molamPay", "stripe", "wave", "express"][Math.floor(Math.random() * 4)];

  const payload = JSON.stringify({
    userId,
    items: [
      { name: "Pizza", price: 12, qty: 1 },
      { name: "Soda", price: 4, qty: 2 }
    ],
    paymentMethod: payment,
    deliveryAddressId: `ADDR_${Math.floor(Math.random() * 1000)}`
  });

  const res = http.post(`${BASE_URL}/api/checkout`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  check(res, {
    "status ok or graceful failure": (r) => [200, 202, 503].includes(r.status)
  });

  sleep(1);
}
