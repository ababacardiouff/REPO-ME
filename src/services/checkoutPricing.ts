import { getPricingAdjustment, computeEffectivePricing } from "./holidayService";
import { evaluate } from "./surgeService";

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

export async function computeFinalPricing(restaurantId: string, items: CheckoutItem[], context: Record<string, unknown>) {
  const holiday = await applyHolidayPricing(restaurantId, items, String(context.at || new Date().toISOString()));
  let finalItems = holiday.items.map((item) => ({ ...item }));

  const surgeRes = await evaluate(restaurantId, {
    ...context,
    orderValue: sum(finalItems)
  });

  const extraFees: Array<{ type: string; value?: number; kind?: string }> = [];
  for (const adj of surgeRes.adjustments || []) {
    const act = (adj as any).action || (adj as any).pricingAdjustment || adj;
    if (Array.isArray(act.applies_to) && act.applies_to.includes("delivery")) {
      extraFees.push({ type: "surge_delivery", value: act.value, kind: act.type });
    }
    if (Array.isArray(act.applies_to) && act.applies_to.includes("menu_items")) {
      if (act.type === "percent") {
        finalItems = finalItems.map((it) => ({ ...it, price: +(it.price * (1 + act.value / 100)).toFixed(2) }));
      } else if (act.type === "fixed") {
        finalItems = finalItems.map((it) => ({ ...it, price: +(it.price + act.value).toFixed(2) }));
      }
    }
  }

  return { items: finalItems, extraFees, meta: { surge: surgeRes, holiday: holiday.adjustments } };
}

function sum(items: CheckoutItem[]) {
  return items.reduce((acc, item) => acc + (item.price || 0), 0);
}
