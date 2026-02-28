import React from "react";

export default function AddressBook({ addresses }: { addresses: Array<{ id: string; label: string; street: string }> }) {
  return (
    <ul>
      {addresses.map((address) => (
        <li key={address.id}>{address.label}: {address.street}</li>
      ))}
    </ul>
  );
}
