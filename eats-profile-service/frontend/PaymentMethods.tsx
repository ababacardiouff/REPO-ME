import React from "react";

export default function PaymentMethods({ methods }: { methods: Array<{ id: string; provider: string; last4: string }> }) {
  return (
    <ul>
      {methods.map((method) => (
        <li key={method.id}>{method.provider} ****{method.last4}</li>
      ))}
    </ul>
  );
}
