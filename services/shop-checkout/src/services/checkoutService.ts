import { prisma } from "../lib/prisma";
import { validateContact } from "../utils/validation";
import { processPayment } from "../infra/paymentGateway";

type AddressInput = {
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
};

export async function getSavedAddresses(userId: string) {
  return prisma.shop_addresses.findMany({ where: { user_id: userId }, orderBy: { is_default: "desc" } });
}

export async function saveAddress(userId: string, input: AddressInput) {
  if (!input.firstName || !input.lastName || !input.line1 || !input.city || !input.country) {
    throw new Error("Missing required address fields");
  }

  if (!validateContact(input.phone, input.email)) {
    throw new Error("At least one contact (phone or email) must be provided and valid");
  }

  const addr = await prisma.shop_addresses.create({
    data: {
      user_id: userId,
      label: input.label,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      email: input.email,
      line1: input.line1,
      line2: input.line2,
      city: input.city,
      postal_code: input.postalCode,
      country: input.country,
      is_default: input.isDefault ?? false,
    },
  });

  if (input.isDefault) {
    await prisma.shop_addresses.updateMany({
      where: { user_id: userId, id: { not: addr.id } },
      data: { is_default: false },
    });
  }

  return addr;
}

export async function createOrder(params: {
  userId: string;
  addressId?: string;
  deliveryAddressId?: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  currency: string;
  idempotencyKey?: string;
  saveAddressAs?: AddressInput | null;
}) {
  const { userId, addressId, deliveryAddressId, items, currency, idempotencyKey, saveAddressAs } = params;

  if (!items || items.length === 0) throw new Error("No items provided");

  if (idempotencyKey) {
    const existing = await prisma.shop_orders.findUnique({ where: { idempotency_key: idempotencyKey } as any });
    if (existing) return existing;
  }

  let billingAddressId = addressId;
  if (!billingAddressId && saveAddressAs) {
    const addr = await saveAddress(userId, saveAddressAs);
    billingAddressId = addr.id;
  }
  if (!billingAddressId) throw new Error("Billing address required");

  const billingAddr = await prisma.shop_addresses.findUnique({ where: { id: billingAddressId } });
  if (!billingAddr) throw new Error("Billing address not found");
  if (!validateContact(billingAddr.phone, billingAddr.email)) throw new Error("Billing contact invalid");

  let total = BigInt(0);
  for (const it of items) {
    if (it.quantity <= 0) throw new Error("Invalid quantity");
    total += BigInt(Math.round(it.unitPrice)) * BigInt(it.quantity);
  }

  const order = await prisma.shop_orders.create({
    data: {
      user_id: userId,
      address_id: billingAddr.id,
      delivery_address_id: deliveryAddressId ?? null,
      total_amount: total as any,
      currency,
      status: "PENDING",
      idempotency_key: idempotencyKey ?? undefined,
    },
  });

  const itemsData = items.map((it) => ({
    order_id: order.id,
    product_id: it.productId,
    quantity: it.quantity,
    unit_price: Math.round(it.unitPrice),
  }));
  await prisma.shop_order_items.createMany({ data: itemsData });

  const paymentResponse = await processPayment({
    orderId: order.id,
    userId,
    amount: Number(total),
    currency,
    description: `Order ${order.id}`,
    idempotencyKey,
  }).catch(async (err) => {
    await prisma.shop_orders.update({
      where: { id: order.id },
      data: { status: "FAILED", payment_reference: (err && err.message) || "ERROR" },
    });
    throw err;
  });

  await prisma.shop_orders.update({
    where: { id: order.id },
    data: { status: "PAID", payment_provider: paymentResponse.provider, payment_reference: paymentResponse.reference },
  });

  return prisma.shop_orders.findUnique({ where: { id: order.id } });
}
