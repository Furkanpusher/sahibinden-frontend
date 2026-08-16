import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Trash2, Pencil } from "lucide-react";
import { fetchListings } from "../../api";

const defaultImages = [
  "/house-1.jpg", "/house-2.jpg", "/house-3.jpg", "/house-4.jpg", "/house-5.jpg",
  "/house-6.jpg", "/house-7.jpg", "/house-8.jpg", "/house-9.jpg", "/house-10.jpg",
];

export default function HouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchListings(`/house/${id}/`)
      .then(setHouse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Oturum açmış kullanıcının bilgilerini ve Token'ını alıyoruz
  const token = localStorage.getItem("access") || localStorage.getItem("token") || localStorage.getItem("access_token");
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const currentUserId = localStorage.getItem("user_id") || storedUser?.id || storedUser?.pk || localStorage.getItem("userId");

  // İlan sahibinin ID'sini güvenli şekilde çekiyoruz
  const ownerId = house?.listing_owner?.id || house?.listing_owner?.pk || house?.listing_owner;

  // token varsa, kullanıcı IDsi varsa, ve ilan sahibiyse true döncek
  const isOwner = Boolean(token) && 
                  Boolean(currentUserId) && 
                  Boolean(ownerId) && 
                  String(currentUserId) === String(ownerId);

  const handleDelete = async () => {
    if (!window.confirm("Bu ev ilanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access") || localStorage.getItem("token") || localStorage.getItem("access_token");
      const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8001/api";
      
      const response = await fetch(`${API_URL}/listings/house/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = resData.detail || resData.hata || resData.message || "İlan silinemedi.";
        throw new Error(errorMessage);
      }

      alert("Ev ilanı başarıyla silindi.");
      navigate("/all-houses");
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

  if (error || !house) {
    return (
      <div className="min-h-screen bg-[#0F1720] flex flex-col items-center justify-center text-[#8B95A3]">
        <p className="mb-4">İlan bulunamadı.</p>
        <Link to="/all-houses" className="text-[#E8A33D] text-sm hover:underline">
          Ev listesine dön
        </Link>
      </div>
    );
  }

  const image = defaultImages[house.id % defaultImages.length];

  const details = [
    { label: "İlan No", value: house.id },
    { label: "İlan Tarihi", value: house.listing_date },
    { label: "Oda Sayısı", value: house.number_of_rooms },
    { label: "Metrekare", value: house.meter_squared ? `${house.meter_squared} m²` : null },
    { label: "Bina Yaşı", value: house.building_aged },
    { label: "Bulunduğu Kat", value: house.floor },
    { label: "Toplam Kat Sayısı", value: house.number_of_floors },
    { label: "Krediye Uygunluk", value: house.credit_eligibility ? "Evet" : "Hayır" },
  ].filter((d) => d.value !== null && d.value !== undefined && d.value !== "");

  return (
    <div className="min-h-screen bg-[#0F1720] px-4 py-5 text-[#EDEFF2] sm:px-6 lg:px-8 lg:py-7">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/all-houses"
          className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8B95A3] transition-colors hover:text-[#EDEFF2]"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Ev ilanlarına dön
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold text-[#EDEFF2] mb-1">
          {house.title || `${house.number_of_rooms || ""} ${house.location || ""}`.trim()}
        </h1>
        {house.location && (
          <p className="flex items-center gap-1.5 text-sm text-[#8B95A3] mb-6">
            <MapPin size={14} /> {house.location}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[55%] shrink-0">
            <div className="rounded-xl overflow-hidden border border-[#232E3D] bg-[#161F2B] aspect-[4/3]">
              <img src={image} alt={house.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 rounded-xl border border-[#232E3D] bg-[#161F2B] p-5">
              <p className="text-xs text-[#8B95A3] mb-1">Fiyat</p>
              <p className="text-2xl font-bold text-[#E8A33D]">
                {house.price ? `${Number(house.price).toLocaleString("tr-TR")} TL` : "Belirtilmemiş"}
              </p>
            </div>
          </div>

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

            {/* SADECE İLAN SAHİBİNE ÖZEL BUTONLAR */}
            {isOwner && (
              <div className="flex gap-3">
                <Link
                  to={`/ev-ilan-guncelle/${house.id}`}
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
