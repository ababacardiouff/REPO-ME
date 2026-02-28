import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 200,
  duration: "1m"
};

export default function () {
  const payload = JSON.stringify({
    orderId: `order-${Math.floor(Math.random() * 100000)}`,
    vendorId: `vendor-${Math.floor(Math.random() * 100)}`,
    orderTotal: 50 + Math.random() * 200
  });

  const res = http.post("http://localhost:3000/api/commissions", payload, {
    headers: { "Content-Type": "application/json" }
  });

  check(res, {
    "status is 201": (r) => r.status === 201
  });

  sleep(0.1);
}
