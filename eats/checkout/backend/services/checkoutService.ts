import { randomUUID } from "crypto";
import molamPay from "./paymentIntegrators/molamPay";
import stripePay from "./paymentIntegrators/stripe";
import wavePay from "./paymentIntegrators/wave";
import { CheckoutItem, CheckoutRequest, CheckoutResult } from "../models/order";

type PaymentStatus = { status: "SUCCESS"; id: string };

class CheckoutService {
  private idempotencyCache = new Map<string, CheckoutResult>();

  async processCheckout(payload: CheckoutRequest): Promise<CheckoutResult> {
    const idempotencyKey = payload.idempotencyKey || randomUUID();
    const cached = this.idempotencyCache.get(idempotencyKey);
    if (cached) {
      return cached;
    }

    const subtotal = this.calculateSubtotal(payload.items);
    const taxes = this.calculateTaxes(subtotal, payload.country);
    const deliveryFee = this.calculateDeliveryFee(payload.deliveryAddress, payload.country);
    const total = Number((subtotal + taxes + deliveryFee).toFixed(2));
    const currency = payload.currency || this.defaultCurrency(payload.country);

    const fraudScore = this.scoreWithFatima(payload.userId, total, payload.paymentMethod);
    if (fraudScore >= 90) {
      throw new Error("Checkout blocked by FATIMA risk scoring");
    }

    const paymentResult = await this.runPayment(payload.userId, payload.paymentMethod, total, currency);

    const result: CheckoutResult = {
      status: paymentResult.status,
      transactionId: paymentResult.id,
      subtotal,
      taxes,
      deliveryFee,
      total,
      currency,
      fraudScore,
      paymentMethodUsed: payload.paymentMethod
    };

    this.idempotencyCache.set(idempotencyKey, result);
    return result;
  }

  private async runPayment(
    userId: string,
    paymentMethod: CheckoutRequest["paymentMethod"],
    total: number,
    currency: string
  ): Promise<PaymentStatus> {
    if (paymentMethod === "molamPay" || paymentMethod === "express") {
      return molamPay.checkout(userId, total, currency);
    }

    if (paymentMethod === "stripe") {
      return stripePay.checkout(userId, total, currency);
    }

    if (paymentMethod === "wave") {
      return wavePay.checkout(userId, total, currency);
    }

    throw new Error("Unsupported payment method");
  }

  private calculateSubtotal(items: CheckoutItem[]) {
    return Number(
      items
        .reduce((sum, item) => {
          const optionsTotal = (item.options || []).reduce((o, option) => o + option.price, 0);
          return sum + (item.price + optionsTotal) * item.qty;
        }, 0)
        .toFixed(2)
    );
  }

  private calculateTaxes(subtotal: number, country?: string) {
    const taxRates: Record<string, number> = { SN: 0.18, FR: 0.2, CI: 0.18 };
    const taxRate = taxRates[country || "SN"] ?? 0.15;
    return Number((subtotal * taxRate).toFixed(2));
  }

  private calculateDeliveryFee(deliveryAddress?: CheckoutRequest["deliveryAddress"], country?: string) {
    if (!deliveryAddress) {
      return 0;
    }

    const base = country === "FR" ? 4 : 2;
    return Number(base.toFixed(2));
  }

  private defaultCurrency(country?: string) {
    const currencies: Record<string, string> = { SN: "XOF", CI: "XOF", FR: "EUR" };
    return currencies[country || "SN"] || "XOF";
  }

  private scoreWithFatima(userId: string, total: number, paymentMethod: string) {
    if (paymentMethod === "wave" && total > 100) {
      return 72;
    }

    if (userId.startsWith("SUSPECT")) {
      return 95;
    }

    return 18;
  }
}

export default new CheckoutService();
