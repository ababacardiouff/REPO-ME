import { query } from "./db";

export async function createModerationRequestAndWait(payload: any, opts: { timeoutMs?: number } = {}) {
  const timeoutMs = opts.timeoutMs || 5000;

  const res = await fetch(`${process.env.MODERATION_SERVICE_URL || "http://localhost:3000"}/api/moderation/requests`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-service-token": process.env.INTERNAL_SERVICE_TOKEN || ""
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  const requestId = data.requestId;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const r = await query("SELECT status, fatima_response FROM moderation_requests WHERE id=$1", [requestId]);
    if (r.rowCount === 1) {
      const status = r.rows[0].status;
      if (status === "ALLOWED") return { action: "ALLOW", requestId };
      if (status === "BLOCKED") {
        return { action: "BLOCK", requestId, reasons: r.rows[0].fatima_response?.reasons || [] };
      }
      if (status === "SANITIZED") {
        return {
          action: "SANITIZE",
          requestId,
          sanitizedText: r.rows[0].fatima_response?.sanitized_text || null
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return { action: "PENDING", requestId };
}
