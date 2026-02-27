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
