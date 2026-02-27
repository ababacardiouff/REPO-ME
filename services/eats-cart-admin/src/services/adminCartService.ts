import { prisma } from "../lib/prisma";

type ListFilters = {
  page?: number;
  perPage?: number;
  status?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function listCarts(filters: ListFilters) {
  const page = Number(filters.page || 1);
  const perPage = Number(filters.perPage || 25);

  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  if (filters.userId) where.user_id = filters.userId;
  if (filters.dateFrom || filters.dateTo) {
    where.updated_at = {
      ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
      ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
    };
  }

  return prisma.eats_carts.findMany({
    where,
    take: perPage,
    skip: (page - 1) * perPage,
    orderBy: { updated_at: "desc" },
  });
}

export async function getCartDetail(cartId: string) {
  return prisma.eats_carts.findUnique({
    where: { id: cartId },
    include: { eats_cart_items: true, eats_cart_schedules: true },
  });
}
