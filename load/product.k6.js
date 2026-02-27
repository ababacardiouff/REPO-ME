import http from "k6/http";
import { check } from "k6";

export const options = { vus: 200, duration: "3m" };

export default function () {
  const res = http.get("http://localhost:3000/api/eats/products");
  check(res, { "status 200": (r) => r.status === 200 });
}
