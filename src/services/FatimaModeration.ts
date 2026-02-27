import axios from "axios";

export async function callFatimaModeration(payload: any) {
  const fatimaUrl = process.env.FATIMA_URL;
  const fatimaKey = process.env.FATIMA_KEY;
  try {
    const res = await axios.post(`${fatimaUrl}/moderation/check`, payload, {
      headers: { "x-api-key": fatimaKey, "content-type": "application/json" },
      timeout: 8000
    });
    return res.data;
  } catch (err: any) {
    return { verdict: "ERROR", reason: err?.message || "Fatima_error" };
  }
}
