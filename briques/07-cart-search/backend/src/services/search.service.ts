import { PrismaClient } from "@prisma/client";
import { FatimaRecommendation } from "./Fatima-recommendation.service";

const prisma = new PrismaClient();

const catalog = [
  { id: "prod-1", name: "Margherita Pizza", tags: ["pizza", "italian"] },
  { id: "prod-2", name: "Cheeseburger", tags: ["burger", "beef"] },
  { id: "prod-3", name: "Chocolate Cake", tags: ["dessert", "cake"] },
  { id: "prod-4", name: "Fresh Orange Juice", tags: ["drink", "juice"] }
];

export const searchService = {
  async search(query: string, userId?: string) {
    const normalized = query.toLowerCase().trim();
    const results = normalized
      ? catalog.filter(
          (item) => item.name.toLowerCase().includes(normalized) || item.tags.some((tag) => tag.includes(normalized))
        )
      : [];

    await prisma.searchLog.create({
      data: {
        query,
        userId: userId || null,
        results: results.length
      }
    });

    if (userId) {
      const cart = await prisma.cart.findFirst({ where: { userId, status: "active" } });
      const cartIds = (Array.isArray(cart?.items) ? (cart?.items as any[]) : []).map((item) => item.id);
      return results.filter((item) => !cartIds.includes(item.id));
    }

    return results;
  },

  async zeroQuery(userId?: string) {
    if (!userId) {
      return catalog.slice(0, 3);
    }
    return FatimaRecommendation(userId, "search").catch(() => catalog.slice(0, 3));
  }
};
