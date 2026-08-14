const API_BASE = "http://localhost:8001/api/listings";

export async function fetchListings(path, params = {}) { // path = (/house/12/) gibi params = {number_of_rooms: 3, floor: 2} gibi
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

export async function postListing(path, data) {
  const token = localStorage.getItem("access_token"); // JWT token'ı localStorage'dan alıyoruz

  if (!token) {
    throw new Error("Lütfen önce giriş yapın.");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    // DRF 'detail' hatası döndüyse direkt onu al, yoksa ilk hatayı al
    const ilkHata = err.detail || (typeof err === "object" ? Object.values(err).flat()[0] : "Bir hata oluştu.");
    throw new Error(String(ilkHata));
  }
  return res.json();
}

