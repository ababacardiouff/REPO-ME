import { Router } from "express";
import { authMiddleware } from "../infra/auth";
import { prisma } from "../lib/prisma";
import { calcOrderTotal } from "../services/orderService";
import type { AuthenticatedRequest } from "../infra/auth";

const router = Router();

type Item = { productId: string; quantity: number; unitPrice: number };

router.post("/", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { items, promoCode, abandonedCartId } = req.body as {
    items: Item[];
    promoCode?: string;
    abandonedCartId?: string;
  };

  if (!items?.length) {
    return res.status(400).json({ error: "No items provided" });
  }

  let discount = 0;
  if (promoCode) {
    const promo = await prisma.eatsPromoCodes.findUnique({ where: { code: promoCode } });
    if (!promo || !promo.active) {
      return res.status(400).json({ error: "Invalid promo code" });
    }
    const now = new Date();
    if (promo.validFrom > now || promo.validTo < now) {
      return res.status(400).json({ error: "Promo expired" });
    }
    if (promo.usedCount >= promo.maxUsage) {
      return res.status(400).json({ error: "Promo max usage reached" });
    }

    discount = promo.discount;
    await prisma.eatsPromoCodes.update({
      where: { id: promo.id },
      data: { usedCount: { increment: 1 } }
    });
  }

  const { total, final } = calcOrderTotal(items, discount);
  const order = await prisma.eatsOrders.create({
    data: {
      userId: req.user?.id || "",
      promoCode: promoCode || null,
      totalAmount: total,
      discountAmount: total - final,
      finalAmount: final,
      abandonedFrom: abandonedCartId || null,
      items: {
        create: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          subtotal: it.quantity * it.unitPrice
        }))
      }
    },
    include: { items: true }
  });

  return res.json(order);
});

router.post("/restore/:cartId", authMiddleware, async (req, res) => {
  const cart = await prisma.eatsAbandonedCarts.findUnique({ where: { id: req.params.cartId } });
  if (!cart || cart.restored) {
    return res.status(404).json({ error: "Cart not available" });
  }

  await prisma.eatsAbandonedCarts.update({ where: { id: cart.id }, data: { restored: true } });

  return res.json({ restoredItems: cart.itemsJson });
});

export default router;
