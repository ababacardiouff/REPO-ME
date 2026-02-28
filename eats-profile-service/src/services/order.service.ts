import { randomUUID } from "node:crypto";

interface Order {
  id: string;
  profile_id: string;
  status: "PENDING" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";
  total_amount: number;
  currency: string;
  created_at: string;
}

interface TrackingStep {
  status: string;
  time: string;
}

interface Tracking {
  orderId: string;
  timeline: TrackingStep[];
}

export class OrderService {
  private readonly orders: Order[] = [
    {
      id: randomUUID(),
      profile_id: "00000000-0000-0000-0000-000000000001",
      status: "DELIVERED",
      total_amount: 12000,
      currency: "XOF",
      created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: randomUUID(),
      profile_id: "00000000-0000-0000-0000-000000000001",
      status: "ON_THE_WAY",
      total_amount: 8500,
      currency: "XOF",
      created_at: new Date().toISOString()
    }
  ];

  getOrderHistory(profileId: string): Order[] {
    return this.orders
      .filter((order) => order.profile_id === profileId)
      .sort((left, right) => right.created_at.localeCompare(left.created_at));
  }

  getTracking(orderId: string): Tracking | null {
    const order = this.orders.find((candidate) => candidate.id === orderId);
    if (!order) {
      return null;
    }

    const timeline: TrackingStep[] = [
      { status: "PENDING", time: order.created_at },
      { status: "PREPARING", time: new Date(Date.parse(order.created_at) + 8 * 60 * 1000).toISOString() },
      { status: "ON_THE_WAY", time: new Date(Date.parse(order.created_at) + 20 * 60 * 1000).toISOString() }
    ];

    if (order.status === "DELIVERED") {
      timeline.push({ status: "DELIVERED", time: new Date(Date.parse(order.created_at) + 35 * 60 * 1000).toISOString() });
    }

    return { orderId: order.id, timeline };
  }
}

export const orderService = new OrderService();
