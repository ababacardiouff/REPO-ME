import axios from "axios";

export async function callFatimaForAccount(payload: { molamId: string; email?: string }) {
  if (!process.env.FATIMA_URL || !process.env.FATIMA_KEY) return null;

  try {
    const res = await axios.post(`${process.env.FATIMA_URL}/v1/score/account`, payload, {
      headers: { Authorization: `Bearer ${process.env.FATIMA_KEY}` },
      timeout: 3000,
    });
    return res.data;
  } catch {
    return { score: 50, reason: "Fatima_unavailable" };
  }
}
