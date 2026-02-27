export default async function fetcher(url: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("molam_token")}` },
  });

  if (!res.ok) throw new Error("Fetch error");
  return res.json();
}
