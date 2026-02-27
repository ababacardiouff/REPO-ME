import { useEffect, useState } from "react";

export default function CartSidebar({ userId }: { userId: string }) {
  const [cart, setCart] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/cart/${userId}`).then((r) => r.json()).then(setCart);
    fetch(`/api/recommendations?userId=${userId}&context=cart`).then((r) => r.json()).then(setRecommendations);
  }, [userId]);

  return (
    <div className="w-96 p-4 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-lg font-bold">Your Cart</h2>
      {cart?.items?.map((item: any) => (
        <div key={item.id} className="flex justify-between">
          <span>
            {item.name} x {item.qty}
          </span>
          <span>${item.price * item.qty}</span>
        </div>
      ))}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Suggested by FATIMA</h3>
        {recommendations.map((r) => (
          <div key={r.id} className="text-sm text-gray-700">
            {r.name}
          </div>
        ))}
      </div>
    </div>
  );
}
