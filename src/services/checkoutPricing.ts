import { getPricingAdjustment, computeEffectivePricing } from "./holidayService";

type CheckoutItem = { price: number; [key: string]: unknown };

export async function applyHolidayPricing(
  restaurantId: string,
  items: CheckoutItem[],
  atIso?: string,
  restaurantMeta?: { country?: string; region?: string }
) {
  const effective = await computeEffectivePricing(restaurantId, atIso || new Date().toISOString(), restaurantMeta);
  if (effective.isBlackout) throw new Error("restaurant_closed_for_holiday");

  let adjustedItems = items.map((item) => ({ ...item }));

  for (const adj of effective.adjustments) {
    const appliesTo = adj.appliesTo || ["menu_items"];
    const adjObj = getPricingAdjustment(adj.pricingAdjustment) as { type?: string; value?: number } | null;
    if (!adjObj || typeof adjObj.value !== "number") continue;
    const value = adjObj.value;

    if (appliesTo.includes("menu_items")) {
      adjustedItems = adjustedItems.map((it) => {
        if (adjObj.type === "percent") {
          return { ...it, price: +(it.price * (1 + value / 100)).toFixed(2) };
        }

        if (adjObj.type === "fixed") {
          return { ...it, price: +(it.price + value).toFixed(2) };
        }

        return it;
      });
    }
  }

  return { items: adjustedItems, adjustments: effective.adjustments };
}
