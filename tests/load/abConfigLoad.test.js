import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "1m", target: 0 }
  ]
};

export default function () {
  const res = http.get("http://localhost:3000/api/ops/ab-config");
  check(res, {
    "status 200": (r) => r.status === 200
  });

  if (__ITER % 10 === 0) {
    const mode = ["A", "B", "C", "random"][Math.floor(Math.random() * 4)];
    const update = http.post("http://localhost:3000/api/ops/ab-config", JSON.stringify({ mode }), {
      headers: { "Content-Type": "application/json" }
    });
    check(update, { "update ok": (r) => r.status === 200 });
  }

  sleep(1);
}
