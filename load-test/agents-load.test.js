import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 500,
  duration: "2m",
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.01"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

export default function () {
  const loginRes = http.post(`${BASE_URL}/api/eats/agents/login`, {
    email: "admin.eats@molam.com",
    password: "Password123!"
  });

  check(loginRes, {
    "login success": (r) => r.status === 200,
    "jwt received": (r) => !!r.json("token")
  });

  const token = loginRes.json("token");
  if (!token) {
    sleep(1);
    return;
  }

  const listRes = http.get(`${BASE_URL}/api/eats/internal/agents`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  check(listRes, {
    "list success": (r) => r.status === 200
  });

  sleep(1);
}
