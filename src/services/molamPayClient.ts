import axios from "axios";

type TransferInput = {
  vendorId: string;
  amount: number;
  currency: string;
};

export class MolamPayClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = process.env.MOLAM_PAY_URL || "https://pay.molam.com/api") {
    this.baseUrl = baseUrl;
  }

  async transfer({ vendorId, amount, currency }: TransferInput) {
    return axios.post(`${this.baseUrl}/v1/payouts`, {
      vendorId,
      amount,
      currency
    });
  }
}
