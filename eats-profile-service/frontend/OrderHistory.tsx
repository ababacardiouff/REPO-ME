import React from "react";

export default function OrderHistory({ orders }: { orders: Array<{ id: string; status: string; total_amount: number }> }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>#{order.id} - {order.status} - {order.total_amount}</li>
      ))}
    </ul>
  );
}
