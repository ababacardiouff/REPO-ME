type PaymentResponse = { status: "SUCCESS"; id: string };

class WavePay {
  async checkout(userId: string, total: number, currency: string): Promise<PaymentResponse> {
    return {
      status: "SUCCESS",
      id: `wave_${userId}_${currency}_${Math.round(total * 100)}_${Date.now()}`
    };
  }
}

export default new WavePay();
