"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const node_crypto_1 = require("node:crypto");
class PaymentService {
    constructor() {
        this.payments = new Map();
    }
    list(profileId) {
        return this.payments.get(profileId) ?? [];
    }
    create(profileId, payload) {
        const current = this.list(profileId);
        const payment = {
            id: (0, node_crypto_1.randomUUID)(),
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
    remove(profileId, id) {
        const current = this.list(profileId);
        const next = current.filter((payment) => payment.id !== id);
        if (current.length === next.length) {
            return false;
        }
        this.payments.set(profileId, this.ensureSingleDefault(next));
        return true;
    }
    ensureSingleDefault(payments, inserted) {
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
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
