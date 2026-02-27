export type CheckoutItem = {
  name: string;
  price: number;
  qty: number;
  options?: { name: string; price: number }[];
};

export type DeliveryAddress = {
  id?: string;
  line1?: string;
  city?: string;
  country?: string;
};

export type CheckoutRequest = {
  userId: string;
  items: CheckoutItem[];
  paymentMethod: "molamPay" | "stripe" | "wave" | "express";
  currency?: string;
  country?: string;
  language?: string;
  deliveryAddress?: DeliveryAddress;
  idempotencyKey?: string;
};

export type CheckoutResult = {
  status: "SUCCESS" | "QUEUED";
  transactionId: string;
  total: number;
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  currency: string;
  fraudScore: number;
  paymentMethodUsed: string;
};
