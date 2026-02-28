"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const node_crypto_1 = require("node:crypto");
class OrderService {
    constructor() {
        this.orders = [
            {
                id: (0, node_crypto_1.randomUUID)(),
                profile_id: "00000000-0000-0000-0000-000000000001",
                status: "DELIVERED",
                total_amount: 12000,
                currency: "XOF",
                created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
            },
            {
                id: (0, node_crypto_1.randomUUID)(),
                profile_id: "00000000-0000-0000-0000-000000000001",
                status: "ON_THE_WAY",
                total_amount: 8500,
                currency: "XOF",
                created_at: new Date().toISOString()
            }
        ];
    }
    getOrderHistory(profileId) {
        return this.orders
            .filter((order) => order.profile_id === profileId)
            .sort((left, right) => right.created_at.localeCompare(left.created_at));
    }
    getTracking(orderId) {
        const order = this.orders.find((candidate) => candidate.id === orderId);
        if (!order) {
            return null;
        }
        const timeline = [
            { status: "PENDING", time: order.created_at },
            { status: "PREPARING", time: new Date(Date.parse(order.created_at) + 8 * 60 * 1000).toISOString() },
            { status: "ON_THE_WAY", time: new Date(Date.parse(order.created_at) + 20 * 60 * 1000).toISOString() }
        ];
        if (order.status === "DELIVERED") {
            timeline.push({ status: "DELIVERED", time: new Date(Date.parse(order.created_at) + 35 * 60 * 1000).toISOString() });
        }
        return { orderId: order.id, timeline };
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
