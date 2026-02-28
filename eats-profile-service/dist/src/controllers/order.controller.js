"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = require("../services/order.service");
const profile_service_1 = require("../services/profile.service");
class OrderController {
    getOrderHistory(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        res.status(200).json(order_service_1.orderService.getOrderHistory(profile.user_id));
    }
    getOrderTracking(req, res) {
        const tracking = order_service_1.orderService.getTracking(req.params.orderId);
        if (!tracking) {
            res.status(404).json({ message: "Tracking unavailable" });
            return;
        }
        res.status(200).json(tracking);
    }
}
exports.default = new OrderController();
