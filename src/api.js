const API_BASE = "http://localhost:8001/api/listings";

export async function fetchListings(path, params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
  ).toString();

  const url = `${API_BASE}${path}${query ? `?${query}` : ""}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`İstek başarısız: ${res.status}`);
  }
  return res.json();
}