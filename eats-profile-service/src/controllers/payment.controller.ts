import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { profileService } from "../services/profile.service";

class PaymentController {
  getPayments(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    res.status(200).json(paymentService.list(profile.id));
  }

  addPayment(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    const payment = paymentService.create(profile.id, req.body);
    res.status(201).json(payment);
  }

  deletePayment(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    const removed = paymentService.remove(profile.id, req.params.id);
    res.status(removed ? 204 : 404).send();
  }
}

export default new PaymentController();
