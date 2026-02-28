import { check, sleep } from "k6";

export const options = { vus: 100, duration: "2m" };

function assignVariant(mode) {
  if (mode === "random") {
    const arr = ["A", "B", "C"];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return mode;
}

export default function () {
  const mode = ["A", "B", "C", "random"][Math.floor(Math.random() * 4)];
  const variant = assignVariant(mode);
  check(variant, { "is valid": (v) => ["A", "B", "C"].includes(v) });
  sleep(0.1);
}
