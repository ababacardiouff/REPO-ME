import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Counter } from "k6/metrics";

const tenant = __ENV.TENANT || "eats";

export const Latency = new Trend(`latency_${tenant}`);
export const Errors = new Counter(`errors_${tenant}`);

const BASE_URL = __ENV.EATS_PLANS_URL || `https://api.molam/${tenant}/health`;

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "1m", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"]
  },
  ext: {
    output: ["experimental-prometheus-rw"]
  }
};

export default function () {
  const res = http.get(BASE_URL);

  check(res, { "status 200": (r) => r.status === 200 }) || Errors.add(1);
  Latency.add(res.timings.duration);

  sleep(1);
}
