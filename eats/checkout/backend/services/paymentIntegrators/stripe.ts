type PaymentResponse = { status: "SUCCESS"; id: string };

class StripePay {
  async checkout(userId: string, total: number, currency: string): Promise<PaymentResponse> {
    return {
      status: "SUCCESS",
      id: `stripe_${userId}_${currency}_${Math.round(total * 100)}_${Date.now()}`
    };
  }
}

export default new StripePay();
