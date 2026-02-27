export function info(...args: unknown[]) {
  console.log("[info]", ...args);
}

export function error(...args: unknown[]) {
  console.error("[error]", ...args);
}
