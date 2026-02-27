import axios from "axios";

export class FatimaClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.FATIMA_URL || "https://fatima.internal";
    this.apiKey = process.env.FATIMA_KEY || "";
  }

  async getMenuBundle(productId: string, userId?: string | null) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/recommend/menu-bundle`,
        { productId, userId: userId ?? null },
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": this.apiKey,
          },
          timeout: 4000,
        }
      );
      return response.data;
    } catch {
      return { items: [], total: 0, reason: "FATIMA_FAIL" };
    }
  }
}
