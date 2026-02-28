export interface OrderItemInput {
  quantity: number;
  unitPrice: number;
}

export function calcOrderTotal(items: OrderItemInput[], discountPercent: number) {
  const total = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const final = total - total * (discountPercent / 100);
  return { total, final };
}
