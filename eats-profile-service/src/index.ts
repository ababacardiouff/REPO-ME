import express from "express";
import AddressController from "./controllers/address.controller";
import OrderController from "./controllers/order.controller";
import PaymentController from "./controllers/payment.controller";
import ProfileController from "./controllers/profile.controller";

export const app = express();
app.use(express.json());

app.get("/profiles/:userId", ProfileController.getProfile);
app.put("/profiles/:userId", ProfileController.updateProfile);
app.put("/profiles/:userId/preferences", ProfileController.updatePreferences);

app.get("/profiles/:userId/addresses", AddressController.getAddresses);
app.post("/profiles/:userId/addresses", AddressController.addAddress);
app.put("/profiles/:userId/addresses/:id", AddressController.updateAddress);
app.delete("/profiles/:userId/addresses/:id", AddressController.deleteAddress);

app.get("/profiles/:userId/payments", PaymentController.getPayments);
app.post("/profiles/:userId/payments", PaymentController.addPayment);
app.delete("/profiles/:userId/payments/:id", PaymentController.deletePayment);

app.get("/profiles/:userId/orders", OrderController.getOrderHistory);
app.get("/orders/:orderId/tracking", OrderController.getOrderTracking);

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Eats Profile Service running on 3000");
  });
}
