import { randomUUID } from "node:crypto";
import { PaymentMethod, PaymentPayload } from "../models/payment.model";

export class PaymentService {
  private readonly payments = new Map<string, PaymentMethod[]>();

  list(profileId: string): PaymentMethod[] {
    return this.payments.get(profileId) ?? [];
  }

  create(profileId: string, payload: PaymentPayload): PaymentMethod {
    const current = this.list(profileId);
    const payment: PaymentMethod = {
      id: randomUUID(),
      profile_id: profileId,
      provider: payload.provider,
      token: payload.token,
      last4: payload.last4,
      is_default: payload.is_default ?? current.length === 0,
      created_at: new Date().toISOString()
    };

    const normalized = this.ensureSingleDefault(current, payment);
    this.payments.set(profileId, normalized);
    return payment;
  }

  remove(profileId: string, id: string): boolean {
    const current = this.list(profileId);
    const next = current.filter((payment) => payment.id !== id);
    if (current.length === next.length) {
      return false;
    }

    this.payments.set(profileId, this.ensureSingleDefault(next));
    return true;
  }

  private ensureSingleDefault(payments: PaymentMethod[], inserted?: PaymentMethod): PaymentMethod[] {
    const items = inserted ? [...payments, inserted] : [...payments];
    const defaultIndex = items.findIndex((payment) => payment.is_default);
    if (defaultIndex === -1 && items.length > 0) {
      items[0].is_default = true;
      return items;
    }

    return items.map((payment, index) => ({
      ...payment,
      is_default: index === defaultIndex
    }));
  }
}

export const paymentService = new PaymentService();
