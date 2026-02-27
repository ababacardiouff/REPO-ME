import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import fetcher from "../lib/fetcher";
import PayerAvecMolamButton from "../components/PayerAvecMolamButton";

function getOrCreateIdempotencyKey() {
  const existing = localStorage.getItem("molam_checkout_key");
  if (existing) return existing;
  const generated = `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  localStorage.setItem("molam_checkout_key", generated);
  return generated;
}

export default function CheckoutPage() {
  const { data: addresses } = useSWR("/api/checkout/addresses", fetcher);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [deliveryDifferent, setDeliveryDifferent] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cart/current");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    })();
  }, []);

  useEffect(() => {
    if (addresses?.length) setSelectedAddress(addresses[0].id);
  }, [addresses]);

  const oneClickReady = !!selectedAddress && items.length > 0;

  const payload = useMemo(
    () => ({
      addressId: selectedAddress,
      deliveryAddressId: deliveryDifferent ? deliveryForm.id : null,
      items: items.map((it) => ({ productId: it.productId, quantity: it.quantity, unitPrice: it.unitPrice })),
      currency: "XOF",
      idempotencyKey: typeof window !== "undefined" ? getOrCreateIdempotencyKey() : undefined,
    }),
    [selectedAddress, deliveryDifferent, deliveryForm.id, items],
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Commande</h1>

      <section className="mt-4">
        <h2 className="font-bold">Adresse de facturation</h2>
        <div>
          {addresses?.length ? (
            addresses.map((a: any) => (
              <label key={a.id} className="block p-2 border rounded mb-2">
                <input
                  type="radio"
                  name="addr"
                  checked={selectedAddress === a.id}
                  onChange={() => setSelectedAddress(a.id)}
                />
                <span className="ml-2">
                  {a.first_name} {a.last_name} — {a.line1}, {a.city}, {a.country}
                </span>
              </label>
            ))
          ) : (
            <div>Aucune adresse sauvegardée</div>
          )}
        </div>
      </section>

      <section className="mt-4">
        <label>
          <input
            type="checkbox"
            checked={deliveryDifferent}
            onChange={(e) => setDeliveryDifferent(e.target.checked)}
          />
          Livraison à une adresse différente
        </label>
        {deliveryDifferent && (
          <div className="mt-2 p-2 border rounded">
            <input placeholder="Prénom" onChange={(e) => setDeliveryForm({ ...deliveryForm, firstName: e.target.value })} />
            <input placeholder="Adresse ligne 1" onChange={(e) => setDeliveryForm({ ...deliveryForm, line1: e.target.value })} />
            <input placeholder="Ville" onChange={(e) => setDeliveryForm({ ...deliveryForm, city: e.target.value })} />
            <input placeholder="Pays" onChange={(e) => setDeliveryForm({ ...deliveryForm, country: e.target.value })} />
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-bold">Résumé commande</h2>
        <ul>
          {items.map((it) => (
            <li key={it.productId}>
              {it.name} x{it.quantity} — {it.unitPrice}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <PayerAvecMolamButton
            disabled={!oneClickReady}
            payload={payload}
            onSuccess={(resp) => {
              localStorage.removeItem("molam_checkout_key");
              window.location.href = `/order/confirmation/${resp.id}`;
            }}
            onError={(err) => alert(`Payment failed: ${err.message}`)}
          />
        </div>
      </section>
    </div>
  );
}
