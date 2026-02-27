import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product } = useSWR(id ? `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/eats/products/${id}` : null, fetcher);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.images?.[0]?.url || "/placeholder.jpg"}
            alt={product.name?.fr || product.name?.en}
            className="rounded"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name?.fr || product.name?.en}</h1>
          <p className="text-gray-600">{product.description?.fr || product.description?.en}</p>
          <div className="mt-4">
            <span className="text-xl font-semibold">
              {(product.price_cents / 100).toFixed(2)} {product.currency}
            </span>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              className="btn-primary"
              onClick={() =>
                fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/eats/checkout/buy`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    productId: product.id,
                    buyerId: "0000",
                    amountCents: product.price_cents,
                    currency: product.currency
                  })
                }).then(() => alert("order created"))
              }
            >
              Buy Now
            </button>
            <button className="btn-secondary" onClick={() => alert("add to cart")}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
