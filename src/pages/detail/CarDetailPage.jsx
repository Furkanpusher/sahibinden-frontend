import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Trash2, Pencil, Heart } from "lucide-react";
import { fetchListings } from "../../api";

const defaultImages = [
  "/car-1.jpg", "/car-2.jpg", "/car-3.jpg", "/car-4.jpg", "/car-5.jpg",
  "/car-6.jpg", "/car-7.jpg", "/car-8.jpg", "/car-9.jpg", "/car-10.jpg",
];

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔹 Favori State'leri
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  // Oturum açmış kullanıcının bilgilerini ve Token'ını alıyoruz
  const token = localStorage.getItem("access") || localStorage.getItem("token") || localStorage.getItem("access_token");
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const currentUserId = localStorage.getItem("user_id") || storedUser?.id || storedUser?.pk || localStorage.getItem("userId");

  const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8001/api";

  // 1. İlan Detayını ve Kullanıcının Favori Durumunu Çek
  useEffect(() => {
    setLoading(true);
    setError(null);

    // İlan detayını getir
    fetchListings(`/car/${id}/`)
      .then((data) => {
        setCar(data);

        // Kullanıcı giriş yapmışsa bu ilan favorilerinde var mı kontrol et
        if (token) {
          fetch(`${API_URL}/listings/my-favorites/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => (res.ok ? res.json() : []))
            .then((favList) => {
              if (Array.isArray(favList)) {
                const found = favList.some(
                  (fav) => String(fav.listing?.id) === String(id)
                );
                setIsFavorited(found);
              }
            })
            .catch((err) => console.error("Favori durumu alınamadı:", err));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token, API_URL]);

  // İlan sahibinin ID'sini güvenli şekilde çekiyoruz
  const ownerId = car?.listing_owner?.id || car?.listing_owner?.pk || car?.listing_owner;

  // token varsa, kullanıcı IDsi varsa, ve ilan sahibiyse true döner
  const isOwner = Boolean(token) && 
                  Boolean(currentUserId) && 
                  Boolean(ownerId) && 
                  String(currentUserId) === String(ownerId);

  // 🔹 FAVORİYE EKLE / ÇIKAR (TOGGLE)
  const handleToggleFavorite = async () => {
    if (!token) {
      if (window.confirm("Bu ilanı favoriye eklemek için giriş yapmalısınız. Giriş sayfasına yönlendirilsin mi?")) {
        navigate("/login");
      }
      return;
    }

    setIsFavoriting(true);
    try {
      const response = await fetch(`${API_URL}/listings/listing/${id}/favorite/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(resData.detail || "Favori işlemi gerçekleştirilemedi.");
      }

      // Backend'den dönen is_favorited (True / False) değerine göre state'i güncelle
      setIsFavorited(resData.is_favorited);
    } catch (err) {
      alert(`Hata: ${err.message}`);
    } finally {
      setIsFavoriting(false);
    }
  };

  // 🔹 İLAN SİLME
  const handleDelete = async () => {
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/listings/car/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMessage = resData.detail || resData.hata || resData.message || JSON.stringify(resData);
        throw new Error(`[HTTP ${response.status}] ${errorMessage}`);
      }
      alert("İlan başarıyla silindi.");
      navigate("/all-cars");
    } catch (err) {
      alert(`Hata: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1720] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#E8A33D]" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-[#0F1720] flex flex-col items-center justify-center text-[#8B95A3]">
        <p className="mb-4">İlan bulunamadı.</p>
        <Link to="/all-cars" className="text-[#E8A33D] text-sm hover:underline">
          Araç listesine dön
        </Link>
      </div>
    );
  }

  const image = defaultImages[car.id % defaultImages.length];

  // Tabloda gösterilecek key-value çiftleri
  const details = [
    { label: "İlan No", value: car.id },
    { label: "İlan Tarihi", value: car.listing_date },
    { label: "Marka", value: car.brand },
    { label: "Seri", value: car.series },
    { label: "Model", value: car.model },
    { label: "Yıl", value: car.year },
    { label: "Yakıt Tipi", value: car.fuel_type },
    { label: "Vites", value: car.transmission_type },
    { label: "Araç Durumu", value: car.status },
    { label: "KM", value: car.km ? Number(car.km).toLocaleString("tr-TR") : null },
    { label: "Kasa Tipi", value: car.body_type },
    { label: "Motor Gücü", value: car.engine_power },
    { label: "Motor Hacmi", value: car.engine_size },
    { label: "Çekiş", value: car.traction },
    { label: "Renk", value: car.color },
    { label: "Ort. Yakıt Tüketimi", value: car.avg_fuel_consumption },
    { label: "Yakıt Deposu", value: car.fuel_tank },
    { label: "Boyalı/Değişen", value: car.changed_parts },
    { label: "Takasa Uygun", value: car.for_trade ? "Evet" : "Hayır" },
    { label: "Kimden", value: car.from_whom },
    { label: "Tramer", value: car.tramer ? `${Number(car.tramer).toLocaleString("tr-TR")} TL` : null },
  ].filter((d) => d.value !== null && d.value !== undefined && d.value !== "");

  return (
    <div className="min-h-screen bg-[#0F1720] px-4 py-5 text-[#EDEFF2] sm:px-6 lg:px-8 lg:py-7">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/all-cars"
          className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8B95A3] transition-colors hover:text-[#EDEFF2]"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Araç ilanlarına dön
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold text-[#EDEFF2] mb-1">
          {car.title || `${car.brand} ${car.model}`}
        </h1>
        {car.city && (
          <p className="flex items-center gap-1.5 text-sm text-[#8B95A3] mb-6">
            <MapPin size={14} /> {car.city} {car.district ? `/ ${car.district}` : ""}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol: Görsel, Favori Butonu ve Fiyat */}
          <div className="lg:w-[55%] shrink-0">
            <div className="relative rounded-xl overflow-hidden border border-[#232E3D] bg-[#161F2B] aspect-[4/3] group">
              <img src={image} alt={car.title} className="w-full h-full object-cover" />

              {/* 💖 FAVORİ (KALP) BUTONU */}
              <button
                onClick={handleToggleFavorite}
                disabled={isFavoriting}
                title={isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                className="absolute top-3 right-3 p-3 rounded-full bg-[#0F1720]/80 backdrop-blur-md border border-[#232E3D] text-[#EDEFF2] hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50"
              >
                {isFavoriting ? (
                  <Loader2 size={20} className="animate-spin text-[#E8A33D]" />
                ) : (
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      isFavorited
                        ? "fill-red-500 text-red-500"
                        : "text-[#8B95A3] hover:text-white"
                    }`}
                  />
                )}
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-[#232E3D] bg-[#161F2B] p-5">
              <p className="text-xs text-[#8B95A3] mb-1">Fiyat</p>
              <p className="text-2xl font-bold text-[#E8A33D]">
                {car.price ? `${Number(car.price).toLocaleString("tr-TR")} TL` : "Belirtilmemiş"}
              </p>
            </div>
          </div>

          {/* Sağ: Key-Value Tablo + Aksiyon Butonları (Düzenle & Sil) */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="rounded-xl border border-[#232E3D] bg-[#161F2B] overflow-hidden">
              {details.map((d, i) => (
                <div
                  key={d.label}
                  className={`flex justify-between px-5 py-3 text-sm ${
                    i % 2 === 0 ? "bg-[#161F2B]" : "bg-[#1A2430]"
                  }`}
                >
                  <span className="text-[#8B95A3]">{d.label}</span>
                  <span className="text-[#EDEFF2] font-medium text-right">{d.value}</span>
                </div>
              ))}
            </div>

            {/* İlan Sahibine Özel Aksiyonlar */}
            {isOwner && (
              <div className="flex gap-3">
                <Link
                  to={`/araba-ilan-guncelle/${car.id}`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#E8A33D]/10 border border-[#E8A33D]/30 px-5 py-3 text-sm font-semibold text-[#E8A33D] hover:bg-[#E8A33D] hover:text-[#0F1720] transition-colors"
                >
                  <Pencil size={16} />
                  İlanı Düzenle
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      İlanı Sil
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
