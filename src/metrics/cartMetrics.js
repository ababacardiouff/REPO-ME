const client = require("prom-client");

const cartNotificationsSent = new client.Counter({
  name: "eats_cart_notifications_sent_total",
  help: "Total number of cart notifications sent",
  labelNames: ["variant"]
});

const cartRestored = new client.Counter({
  name: "eats_cart_restored_total",
  help: "Carts restored after notification",
  labelNames: ["variant"]
});

module.exports = { cartNotificationsSent, cartRestored };
