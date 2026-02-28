"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const address_controller_1 = __importDefault(require("./controllers/address.controller"));
const order_controller_1 = __importDefault(require("./controllers/order.controller"));
const payment_controller_1 = __importDefault(require("./controllers/payment.controller"));
const profile_controller_1 = __importDefault(require("./controllers/profile.controller"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get("/profiles/:userId", profile_controller_1.default.getProfile);
exports.app.put("/profiles/:userId", profile_controller_1.default.updateProfile);
exports.app.put("/profiles/:userId/preferences", profile_controller_1.default.updatePreferences);
exports.app.get("/profiles/:userId/addresses", address_controller_1.default.getAddresses);
exports.app.post("/profiles/:userId/addresses", address_controller_1.default.addAddress);
exports.app.put("/profiles/:userId/addresses/:id", address_controller_1.default.updateAddress);
exports.app.delete("/profiles/:userId/addresses/:id", address_controller_1.default.deleteAddress);
exports.app.get("/profiles/:userId/payments", payment_controller_1.default.getPayments);
exports.app.post("/profiles/:userId/payments", payment_controller_1.default.addPayment);
exports.app.delete("/profiles/:userId/payments/:id", payment_controller_1.default.deletePayment);
exports.app.get("/profiles/:userId/orders", order_controller_1.default.getOrderHistory);
exports.app.get("/orders/:orderId/tracking", order_controller_1.default.getOrderTracking);
if (require.main === module) {
    exports.app.listen(3000, () => {
        console.log("Eats Profile Service running on 3000");
    });
}
