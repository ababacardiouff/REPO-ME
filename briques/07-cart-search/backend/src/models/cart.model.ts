export type CartStatus = "active" | "checkedout";

export interface CartItem {
  id: string;
  qty: number;
  name?: string;
  price?: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  status: CartStatus;
  createdAt: Date;
  updatedAt: Date;
}
