import { PrismaClient, Prisma } from "@prisma/client";
import { callFatimaModeration } from "./FatimaClient";
import { publishEvent } from "./eventBus";

const prisma = new PrismaClient();

type JsonMap = Record<string, unknown>;

async function audit(actorMolamId: string | null, action: string, targetType: string, targetId: string, payload: unknown) {
  await prisma.eatsCatalogAudit.create({
    data: { actorMolamId, action, targetType, targetId, payload: payload as Prisma.InputJsonValue }
  });
}

export async function createRestaurant(molamId: string, payload: JsonMap) {
  const restaurant = await prisma.eatsRestaurant.create({
    data: {
      molamId,
      vendorId: payload.vendorId as string | undefined,
      name: payload.name as Prisma.InputJsonValue,
      slug: String(payload.slug),
      description: payload.description as Prisma.InputJsonValue | undefined,
      logoUrl: payload.logoUrl as string | undefined,
      country: payload.country as string | undefined,
      currency: payload.currency as string | undefined,
      language: payload.language as string | undefined
    }
  });

  await audit(molamId, "CREATE_RESTAURANT", "restaurant", restaurant.id, payload);
  await publishEvent("eats.restaurant.created", { restaurantId: restaurant.id, molamId });
  return restaurant;
}

export const getRestaurant = (id: string) => prisma.eatsRestaurant.findUnique({ where: { id } });

export async function updateRestaurant(id: string, payload: JsonMap, actorMolamId: string) {
  const updated = await prisma.eatsRestaurant.update({ where: { id }, data: payload });
  await audit(actorMolamId, "UPDATE_RESTAURANT", "restaurant", id, payload);
  await publishEvent("eats.restaurant.updated", { restaurantId: id, actorMolamId });
  return updated;
}

export async function deleteRestaurant(id: string, actorMolamId: string) {
  await prisma.eatsRestaurant.delete({ where: { id } });
  await audit(actorMolamId, "DELETE_RESTAURANT", "restaurant", id, {});
  await publishEvent("eats.restaurant.deleted", { restaurantId: id, actorMolamId });
}

export async function createCategory(restaurantId: string, payload: JsonMap, actorMolamId: string) {
  const category = await prisma.eatsCatalogCategory.create({
    data: {
      restaurantId,
      code: String(payload.code),
      name: payload.name as Prisma.InputJsonValue,
      position: Number(payload.position || 0),
      visible: payload.visible !== false
    }
  });
  await audit(actorMolamId, "CREATE_CATEGORY", "category", category.id, payload);
  return category;
}

export async function updateCategory(id: string, payload: JsonMap, actorMolamId: string) {
  const category = await prisma.eatsCatalogCategory.update({ where: { id }, data: payload });
  await audit(actorMolamId, "UPDATE_CATEGORY", "category", id, payload);
  return category;
}

export async function deleteCategory(id: string, actorMolamId: string) {
  await prisma.eatsCatalogCategory.delete({ where: { id } });
  await audit(actorMolamId, "DELETE_CATEGORY", "category", id, {});
}

export async function createItem(restaurantId: string, payload: JsonMap, actorMolamId: string) {
  const fatimaResult = await callFatimaModeration({ text: payload.name, images: payload.images as unknown[] | undefined });
  if (fatimaResult.blocked) throw new Error("content_blocked");

  const item = await prisma.eatsCatalogItem.create({
    data: {
      restaurantId,
      categoryId: payload.categoryId as string | undefined,
      sku: payload.sku as string | undefined,
      name: payload.name as Prisma.InputJsonValue,
      description: payload.description as Prisma.InputJsonValue | undefined,
      images: payload.images as Prisma.InputJsonValue | undefined,
      price: new Prisma.Decimal(String(payload.price)),
      currency: String(payload.currency),
      active: payload.active !== false,
      stock: payload.stock as number | undefined,
      prepTimeMinutes: Number(payload.prepTimeMinutes || 0),
      isDeliveryOnly: Boolean(payload.isDeliveryOnly),
      externalFlags: payload.externalFlags as Prisma.InputJsonValue | undefined
    }
  });

  await audit(actorMolamId, "CREATE_ITEM", "item", item.id, { ...payload, fatimaResult });
  await publishEvent("eats.item.created", { itemId: item.id, restaurantId });
  return item;
}

export const getItem = (id: string) => prisma.eatsCatalogItem.findUnique({ where: { id }, include: { variants: true } });

export async function updateItem(id: string, payload: JsonMap, actorMolamId: string) {
  const updated = await prisma.eatsCatalogItem.update({ where: { id }, data: payload });
  await audit(actorMolamId, "UPDATE_ITEM", "item", id, payload);
  await publishEvent("eats.item.updated", { itemId: id, actorMolamId });
  return updated;
}

export async function deleteItem(id: string, actorMolamId: string) {
  await prisma.eatsCatalogItem.delete({ where: { id } });
  await audit(actorMolamId, "DELETE_ITEM", "item", id, {});
  await publishEvent("eats.item.deleted", { itemId: id, actorMolamId });
}

export async function createVariant(itemId: string, payload: JsonMap, actorMolamId: string) {
  const variant = await prisma.eatsCatalogItemVariant.create({
    data: {
      itemId,
      code: String(payload.code),
      name: payload.name as Prisma.InputJsonValue,
      priceDelta: new Prisma.Decimal(String(payload.priceDelta || 0)),
      isDefault: Boolean(payload.isDefault),
      position: Number(payload.position || 0)
    }
  });
  await audit(actorMolamId, "CREATE_VARIANT", "variant", variant.id, payload);
  return variant;
}

export async function updateVariant(id: string, payload: JsonMap, actorMolamId: string) {
  const variant = await prisma.eatsCatalogItemVariant.update({ where: { id }, data: payload });
  await audit(actorMolamId, "UPDATE_VARIANT", "variant", id, payload);
  return variant;
}

export async function deleteVariant(id: string, actorMolamId: string) {
  await prisma.eatsCatalogItemVariant.delete({ where: { id } });
  await audit(actorMolamId, "DELETE_VARIANT", "variant", id, {});
}

export async function getRestaurantMenu(restId: string) {
  return prisma.eatsCatalogCategory.findMany({
    where: { restaurantId: restId, visible: true },
    orderBy: { position: "asc" },
    include: {
      items: {
        where: { active: true },
        include: { variants: true }
      }
    }
  });
}

export async function searchItems(q?: string, restaurantId?: string) {
  return prisma.eatsCatalogItem.findMany({
    where: {
      restaurantId: restaurantId || undefined,
      active: true,
      ...(q
        ? {
            OR: [
              { sku: { contains: q, mode: "insensitive" } },
              { name: { path: ["fr"], string_contains: q } },
              { name: { path: ["en"], string_contains: q } }
            ]
          }
        : {})
    },
    take: 100,
    orderBy: { updatedAt: "desc" }
  });
}
