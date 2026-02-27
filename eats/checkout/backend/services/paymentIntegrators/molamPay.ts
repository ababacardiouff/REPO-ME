type PaymentResponse = { status: "SUCCESS"; id: string };

class MolamPay {
  async checkout(userId: string, total: number, currency: string): Promise<PaymentResponse> {
    return {
      status: "SUCCESS",
      id: `molam_${userId}_${currency}_${Math.round(total * 100)}_${Date.now()}`
    };
  }
}

export default new MolamPay();
