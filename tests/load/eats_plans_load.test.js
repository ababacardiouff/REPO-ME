import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 100 },
    { duration: "3m", target: 300 },
    { duration: "1m", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<800"]
  }
};

const BASE_URL = __ENV.BASE_URL || "https://staging.api.molam-eats.com";

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/eats/plans`);
  check(res, {
    "plans endpoint status 200": (r) => r.status === 200
  });
  sleep(1);
}
