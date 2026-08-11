import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { fetchListings } from "../api";
import { FilterInput, ListingCard } from "../components/ListingUI";

export default function HouseListPage() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    number_of_rooms: "",
    price_min: "",
    price_max: "",
    location: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchListings("/all-houses/", filters)
      .then(setHouses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleChange = (field) => (e) =>
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#0F1720] p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[#8B95A3] hover:text-[#EDEFF2] text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Ana sayfa
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-[#161F2B] border border-[#232E3D] rounded-2xl p-5 sticky top-6">
              <div className="flex items-center gap-2 mb-4 text-[#EDEFF2] font-medium text-sm">
                <SlidersHorizontal size={15} /> Filtrele
              </div>

              <FilterInput
                label="Oda Sayısı"
                placeholder="3+1"
                value={filters.number_of_rooms}
                onChange={handleChange("number_of_rooms")}
              />
              <FilterInput
                label="Min. Fiyat"
                type="number"
                placeholder="0"
                value={filters.price_min}
                onChange={handleChange("price_min")}
              />
              <FilterInput
                label="Max. Fiyat"
                type="number"
                placeholder="1000000"
                value={filters.price_max}
                onChange={handleChange("price_max")}
              />
              <FilterInput
                label="Konum"
                placeholder="Ankara"
                value={filters.location}
                onChange={handleChange("location")}
              />
            </div>
          </aside>

          <main className="flex-1">
            <h1 className="text-xl font-semibold text-[#EDEFF2] mb-4">
              Ev İlanları {!loading && `(${houses.length})`}
            </h1>

            {loading && <p className="text-[#8B95A3] text-sm">Yükleniyor...</p>}
            {error && (
              <p className="text-[#E88080] text-sm">
                Bir hata oluştu: {error}
              </p>
            )}
            {!loading && !error && houses.length === 0 && (
              <p className="text-[#8B95A3] text-sm">
                Bu kriterlere uygun ilan bulunamadı.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {houses.map((house) => (
                <ListingCard
                  key={house.id}
                  title={house.title}
                  location={house.location}
                  price={house.price}
                  extraLines={[
                    house.number_of_rooms,
                    house.meter_squared ? `${house.meter_squared} m²` : null,
                    house.floor ? `${house.floor}. kat` : null,
                  ].filter(Boolean)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}