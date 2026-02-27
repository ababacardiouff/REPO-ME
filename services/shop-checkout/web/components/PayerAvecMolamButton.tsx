import React from "react";

type Props = {
  disabled?: boolean;
  payload: any;
  onSuccess: (resp: any) => void;
  onError: (err: any) => void;
};

export default function PayerAvecMolamButton({ disabled, payload, onSuccess, onError }: Props) {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("molam_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Order failed");
      onSuccess(json);
    } catch (err: any) {
      onError(err);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label="Payer avec Molam"
      className={`px-6 py-3 rounded-lg ${disabled ? "opacity-50" : "bg-black text-white"}`}
    >
      Payer avec Molam
    </button>
  );
}
