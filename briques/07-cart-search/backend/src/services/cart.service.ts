import { PrismaClient } from "@prisma/client";
import { FatimaRecommendation } from "./Fatima-recommendation.service";

const prisma = new PrismaClient();

type CartItem = { id: string; qty: number; name?: string; price?: number };

export const cartService = {
  async addItem(userId: string, productId: string, qty: number) {
    const active = await this.getActiveCart(userId);
    const items: CartItem[] = Array.isArray(active.items) ? (active.items as CartItem[]) : [];
    const existing = items.find((item) => item.id === productId);

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }

    const updated = await prisma.cart.update({
      where: { id: active.id },
      data: { items }
    });

    const recommendations = await FatimaRecommendation(userId, "cart").catch(() => []);

    return { ...updated, recommendations };
  },

  async getActiveCart(userId: string) {
    const existing = await prisma.cart.findFirst({
      where: { userId, status: "active" },
      orderBy: { createdAt: "desc" }
    });

    if (existing) {
      return existing;
    }

    return prisma.cart.create({
      data: { userId, items: [] }
    });
  }
};
