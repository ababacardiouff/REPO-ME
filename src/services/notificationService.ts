import axios from "axios";

function getVariantMessage(variant: string, user: any, cart: any) {
  switch (variant) {
    case "B":
      return {
        subject: "🔥 Hurry! Your cart is almost gone",
        body: `Hi ${user.first_name}, products in your cart are in high demand. Checkout now before they run out!`
      };
    case "C":
      return {
        subject: "🎁 Special offer just for you",
        body: `Hi ${user.first_name}, complete your cart today and enjoy a surprise promo from Molam Eats!`
      };
    default:
      return {
        subject: "You left something in your cart 🛒",
        body: `Hello ${user.first_name}, you still have ${cart.items.length} items waiting. Complete your order easily now!`
      };
  }
}

export async function sendCartNotification(user: any, cart: any) {
  const variant = cart.variant || "A";
  const { subject, body } = getVariantMessage(variant, user, cart);

  if (user.email) {
    await axios.post("http://mailer-service/send", { to: user.email, subject, body });
  }

  if (user.phone) {
    await axios.post("http://sms-gateway/send", {
      to: user.phone,
      text: body.replace(/<[^>]*>?/gm, "").slice(0, 160)
    });
  }

  await axios.post("http://molam-talk-service/push", {
    userId: user.id,
    type: "cart_reminder",
    payload: { cartId: cart.id, message: body }
  });
}
