import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 100 },
    { duration: "2m", target: 300 },
    { duration: "30s", target: 0 },
  ],
};

const BASE = __ENV.BASE || "http://localhost:3000";

export default function () {
  const token = "FAKE-TEST-TOKEN";

  const addrRes = http.post(
    `${BASE}/api/checkout/addresses`,
    JSON.stringify({
      firstName: "Load",
      lastName: "Test",
      phone: "+221770000000",
      line1: "1 test",
      city: "Dakar",
      country: "Senegal",
    }),
    { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } },
  );
  check(addrRes, { "addr created": (r) => r.status === 200 });

  const addrId = JSON.parse(addrRes.body).id;
  const orderRes = http.post(
    `${BASE}/api/checkout/order`,
    JSON.stringify({
      addressId: addrId,
      items: [{ productId: "prod-1", quantity: 1, unitPrice: 1000 }],
      currency: "XOF",
      idempotencyKey: `load-${__VU}-${Date.now()}`,
    }),
    { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } },
  );
  check(orderRes, { "order status 200 or 400": (r) => r.status === 200 || r.status === 400 });
  sleep(1);
}
