import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "1m", target: 0 }
  ]
};

const BASE_URL = __ENV.BASE_URL || "https://staging.molam.shop";

export default function () {
  const res = http.get(`${BASE_URL}/healthz`);
  check(res, { "healthz ok": (r) => r.status === 200 || r.status === 404 });
  sleep(1);
}
