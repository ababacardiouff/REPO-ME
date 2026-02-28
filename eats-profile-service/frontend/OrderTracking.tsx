import React from "react";

export default function OrderTracking({ order }: { order: { id: string; timeline: Array<{ status: string; time: string }> } }) {
  return (
    <div className="p-4">
      <h2>Tracking Order #{order.id}</h2>
      <ul>
        {order.timeline.map((step, idx) => (
          <li key={idx}>{step.status} - {step.time}</li>
        ))}
      </ul>
    </div>
  );
}
