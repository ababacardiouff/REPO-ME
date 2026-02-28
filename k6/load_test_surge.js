import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95) < 1000"]
  }
};

const BASE = __ENV.BASE || "http://localhost:3000";

export default function () {
  const payload = JSON.stringify({
    at: new Date().toISOString(),
    demandRatio: Math.random() * 3,
    queueLength: Math.floor(Math.random() * 30),
    avgETA: Math.floor(Math.random() * 60),
    weather: { condition: Math.random() > 0.9 ? "storm" : "clear" }
  });

  const res = http.post(`${BASE}/api/surge/restaurants/resto-1/evaluate`, payload, {
    headers: { "Content-Type": "application/json" }
  });
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(0.1);
}
