import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "30s", target: 0 },
  ],
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const cartId = "11111111-1111-1111-1111-111111111111";
  const payload = JSON.stringify({
    productId: "22222222-2222-2222-2222-222222222222",
    quantity: Math.floor(Math.random() * 5) + 1,
    scheduledDate: "2025-09-25",
  });

  const res = http.post(`${BASE_URL}/cart/${cartId}/items`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "status 200": (r) => r.status === 200,
    "response has id": (r) => r.json("id") !== undefined,
  });

  sleep(1);
}
