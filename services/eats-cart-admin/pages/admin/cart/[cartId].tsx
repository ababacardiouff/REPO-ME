import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../../lib/fetcher";

export default function AdminCartDetail() {
  const router = useRouter();
  const { cartId } = router.query;
  const { data, mutate } = useSWR(cartId ? `/api/admin/cart/${cartId}` : null, fetcher);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Cart {cartId}</h1>
      <div className="mt-4">
        <h2 className="font-bold">Items</h2>
        <table className="w-full mt-2">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Scheduled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.eats_cart_items.map((it: any) => (
              <tr key={it.id}>
                <td>{it.product_id}</td>
                <td>{it.quantity}</td>
                <td>{new Date(it.scheduled_date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={async () => {
                      await fetch(`/api/admin/cart/${cartId}/items/${it.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${localStorage.getItem("molam_token")}` },
                      });
                      mutate();
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
