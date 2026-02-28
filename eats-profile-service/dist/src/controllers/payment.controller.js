"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = require("../services/payment.service");
const profile_service_1 = require("../services/profile.service");
class PaymentController {
    getPayments(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        res.status(200).json(payment_service_1.paymentService.list(profile.id));
    }
    addPayment(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        const payment = payment_service_1.paymentService.create(profile.id, req.body);
        res.status(201).json(payment);
    }
    deletePayment(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        const removed = payment_service_1.paymentService.remove(profile.id, req.params.id);
        res.status(removed ? 204 : 404).send();
    }
}
exports.default = new PaymentController();
