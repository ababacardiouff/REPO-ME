import axios from "axios";
import { FatimaValidationFailures } from "../infra/metrics";

const FATIMA_URL = process.env.FATIMA_URL;

export async function validateItemWithFatima(item: unknown) {
  try {
    const resp = await axios.post(`${FATIMA_URL}/api/v1/eats/validate`, item, {
      timeout: 5000,
      headers: { "x-api-key": process.env.FATIMA_KEY || "" }
    });
    return resp.data;
  } catch (error: any) {
    FatimaValidationFailures.inc({ reason: error?.code || "unknown" }, 1);
    throw error;
  }
}
