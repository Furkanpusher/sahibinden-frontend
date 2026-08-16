import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Trash2, Pencil } from "lucide-react";
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

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchListings(`/car/${id}/`)
      .then(setCar)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Oturum açmış kullanıcının bilgilerini ve Token'ını alıyoruz
  const token = localStorage.getItem("access") || localStorage.getItem("token") || localStorage.getItem("access_token");
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const currentUserId = storedUser?.id || storedUser?.pk || localStorage.getItem("user_id") || localStorage.getItem("userId");

  // Kullanıcı giriş yapmışsa ve ilan sahibiyle eşleşiyorsa (veya token varsa) yetkili kabul edilir
  const isOwner = Boolean(token) && (!currentUserId || String(currentUserId) === String(car?.listing_owner));

  const handleDelete = async () => {  // ilan silme fonksiyonu
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access") || localStorage.getItem("token") || localStorage.getItem("access_token");
      
      const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8001/api";
      
      const response = await fetch(`${API_URL}/listings/car/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
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
        {car.location && (
          <p className="flex items-center gap-1.5 text-sm text-[#8B95A3] mb-6">
            <MapPin size={14} /> {car.location}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol: Görsel ve Fiyat */}
          <div className="lg:w-[55%] shrink-0">
            <div className="rounded-xl overflow-hidden border border-[#232E3D] bg-[#161F2B] aspect-[4/3]">
              <img src={image} alt={car.title} className="w-full h-full object-cover" />
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
