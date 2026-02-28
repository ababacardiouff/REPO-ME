import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { profileService } from "../services/profile.service";

class OrderController {
  getOrderHistory(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    res.status(200).json(orderService.getOrderHistory(profile.user_id));
  }

  getOrderTracking(req: Request, res: Response): void {
    const tracking = orderService.getTracking(req.params.orderId);
    if (!tracking) {
      res.status(404).json({ message: "Tracking unavailable" });
      return;
    }
    res.status(200).json(tracking);
  }
}

export default new OrderController();
