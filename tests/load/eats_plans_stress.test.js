import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "5m", target: 500 },
    { duration: "5m", target: 1000 },
    { duration: "5m", target: 1500 },
    { duration: "5m", target: 2000 },
    { duration: "5m", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<1000"]
  }
};

const BASE_URL = __ENV.BASE_URL || "https://staging.api.molam-eats.com";

export default function () {
  const res1 = http.post(`${BASE_URL}/api/v1/eats/plans/signup`, JSON.stringify({
    name: "Test Vendor",
    email: `vendor_${__VU}_${__ITER}@example.com`,
    plan: "professional"
  }), { headers: { "Content-Type": "application/json" } });
  check(res1, {
    "signup status 200": (r) => r.status === 200
  });

  const res2 = http.get(`${BASE_URL}/api/v1/eats/plans`);
  check(res2, {
    "plans fetched": (r) => r.status === 200
  });

  const res3 = http.get(`${BASE_URL}/api/v1/eats/account/details`);
  check(res3, {
    "account details ok": (r) => r.status === 200
  });

  sleep(1);
}
