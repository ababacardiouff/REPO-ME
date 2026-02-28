import http from "k6/http";
import { check, sleep } from "k6";

export const options = { vus: 50, duration: "1m" };

export default function () {
  const res = http.get("http://localhost:3000/api/ops/ab-config?injectLatency=2000");
  check(res, {
    "status 200": (r) => r.status === 200,
    "response time acceptable": (r) => r.timings.duration < 2500
  });
  sleep(0.5);
}
