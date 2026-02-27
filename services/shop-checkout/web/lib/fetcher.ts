export default async function fetcher(url: string, options: any = {}) {
  const headers = options.headers || {};
  const token = localStorage.getItem("molam_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`Fetch error ${res.status}`);
  return res.json();
}
