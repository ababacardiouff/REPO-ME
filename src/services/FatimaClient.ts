import axios from "axios";

export async function scoreVendor(payload: unknown) {
  const url = process.env.FATIMA_URL || "http://localhost:9000";
  try {
    const resp = await axios.post(`${url}/score/vendor`, payload, {
      headers: { "x-api-key": process.env.FATIMA_KEY || "" },
      timeout: 3000
    });
    return resp.data as { score?: number; suggested_category?: string | null; autofill?: Record<string, unknown> };
  } catch {
    return { score: 40, suggested_category: null, autofill: {} };
  }
}

export async function callFatimaModeration(payload: { text?: unknown; images?: unknown[] }) {
  if (!process.env.FATIMA_URL || !process.env.FATIMA_KEY) {
    return { blocked: false, score: 50, reviewRequired: true };
  }

  try {
    const res = await axios.post(`${process.env.FATIMA_URL}/v1/moderate/content`, payload, {
      headers: { Authorization: `Bearer ${process.env.FATIMA_KEY}` },
      timeout: 3000
    });

    return res.data as { blocked: boolean; score?: number; reviewRequired?: boolean };
  } catch {
    return { blocked: false, score: 50, reviewRequired: true };
  }
}
