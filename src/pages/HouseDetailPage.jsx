import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { fetchListings } from "../api";

const defaultImages = [
  "/house-1.jpg", "/house-2.jpg", "/house-3.jpg", "/house-4.jpg", "/house-5.jpg",
  "/house-6.jpg", "/house-7.jpg", "/house-8.jpg", "/house-9.jpg", "/house-10.jpg",
];

export default function HouseDetailPage() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchListings(`/house/${id}/`)
      .then(setHouse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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

  const details = [ // tabladoki gösterilcek bilgiler
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
          {/* Sol: görsel */}
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

          {/* Sağ: key-value tablo */}
          <div className="flex-1 rounded-xl border border-[#232E3D] bg-[#161F2B] overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}