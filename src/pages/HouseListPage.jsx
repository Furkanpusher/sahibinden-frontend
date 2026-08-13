import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom"; 
import {
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
  SearchX,
} from "lucide-react";
import { fetchListings } from "../api";
import { FilterInput, FilterSelect } from "../components/ListingUI";

export default function HouseListPage() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook doğru şekilde burada tanımlandı
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    number_of_rooms: searchParams.get("number_of_rooms") || "", 
    price_min: searchParams.get("price_min") || "",
    price_max: searchParams.get("price_max") || "",
    city: searchParams.get("city") || "",
    district: searchParams.get("district") || "",
  });

const [options, setOptions] = useState({
  cities: [],
  districts: [],
  number_of_rooms: [],
});

  const defaultImages = [ // ev resimleri
    "/house-1.jpg",
    "/house-2.jpg",
    "/house-3.jpg",
    "/house-4.jpg",
    "/house-5.jpg",
    "/house-6.jpg",
    "/house-7.jpg",
    "/house-8.jpg",
    "/house-9.jpg",
    "/house-10.jpg",
  ];

  useEffect(() => { // Tüm evleri çek ve filters dagönder
    setLoading(true);
    setError(null);

    fetchListings("/all-houses/", filters)
      .then(setHouses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { // house dropdown
  const params = filters.city ? { city: filters.city } : {};
  fetchListings("/house-options/", params)
    .then((data) => {
      setOptions({
        cities: data.cities || [],
        districts: data.districts || [],
        number_of_rooms: data.number_of_rooms || [],
      });
    })
    .catch((err) => console.error("Filtre seçenekleri alınamadı:", err));
}, [filters.city]);


  const handleChange = (field) => (e) => {
  const newValue = e.target.value;
  setFilters((prev) => {
    const updated = {
      ...prev,
      [field]: newValue,
      ...(field === "city" ? { district: "" } : {}),
    };
    const cleanParams = Object.fromEntries(
      Object.entries(updated).filter(([_, v]) => v !== "")
    );
    setSearchParams(cleanParams);
    return updated;
  });
};

  const formatTitle = (title) => {
    if (!title) return "";
    return title.length > 120 ? `${title.substring(0, 120)}...` : title;
  };

  return (
    <div className="min-h-screen bg-[#0F1720] px-4 py-5 text-[#EDEFF2] sm:px-6 lg:px-8 lg:py-7">
      <div className="w-full">

        {/* Page Header */}
        <header className="mb-7 border-b border-[#232E3D] pb-5">
          <Link
            to="/"
            className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8B95A3] transition-colors hover:text-[#EDEFF2]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Ana sayfa
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#EDEFF2] sm:text-3xl">
                Ev İlanları
              </h1>

              <p className="mt-1 text-sm text-[#667384]">
                Aradığın evi filtreleyerek hızlıca bul.
              </p>
            </div>

            {!loading && houses.length > 0 && (
              <span className="w-fit rounded-lg border border-[#232E3D] bg-[#161F2B] px-3 py-1.5 text-xs font-medium text-[#8B95A3]">
                {houses.length} sonuç
              </span>
            )}
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Filter Sidebar */}
          <aside className="w-full shrink-0 lg:w-64 xl:w-72">
            <div className="rounded-xl border border-[#232E3D] bg-[#161F2B] p-5 lg:sticky lg:top-6">

              <div className="mb-5 flex items-center gap-2 border-b border-[#232E3D] pb-4 text-sm font-semibold text-[#EDEFF2]">
                <SlidersHorizontal size={16} />
                Filtrele
              </div>

              <div className="flex flex-col space-y-4">

                
                {/* Filtrelerim */}
                 {/* Oda Sayısı Dropdown */}
                <FilterSelect
                  label="Oda Sayısı"
                  value={filters.number_of_rooms}
                  onChange={handleChange("number_of_rooms")}
                >
                  <option value="">Tüm Oda Sayıları</option>
                  {options.number_of_rooms.map((r) => {
                    const val = typeof r === "object" ? r.name : r;
                    const countStr = typeof r === "object" && r.count ? ` (${r.count})` : "";
                    return (
                      <option key={val} value={val}>
                        {val}{countStr}
                      </option>
                    );
                  })}
                </FilterSelect>

                {/* Şehir Dropdown */}
                <FilterSelect
                  label="Şehir"
                  value={filters.city}
                  onChange={handleChange("city")}
                >
                  <option value="">Tüm Şehirler</option>
                  {options.cities.map((c) => {
                    const val = typeof c === "object" ? c.name : c;
                    const countStr = typeof c === "object" && c.count ? ` (${c.count})` : "";
                    return (
                      <option key={val} value={val}>
                        {val}{countStr}
                      </option>
                    );
                  })}
                </FilterSelect>

                <FilterSelect
                  label="Semt / İlçe"
                  value={filters.district}
                  onChange={handleChange("district")}
                >
                  <option value="">Tüm İlçeler</option>
                  {options.districts.map((d) => {
                    const val = typeof d === "object" ? d.name : d;
                    const countStr = typeof d === "object" && d.count ? ` (${d.count})` : "";
                    return (
                      <option key={val} value={val}>
                        {val}{countStr}
                      </option>
                    );
                  })}
                </FilterSelect>

                 {/* Fiyat İnputları */}
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
                    placeholder="1.000.000"
                    value={filters.price_max}
                    onChange={handleChange("price_max")}
                  />

              </div>
            </div>
          </aside>

          {/* Listings */}
          <main className="min-w-0 flex-1">

            {/* Loading */}
            {loading && (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-[#8B95A3]">
                <Loader2
                  size={32}
                  className="mb-3 animate-spin text-[#E8A33D]"
                />

                <p className="text-sm font-medium">
                  İlanlar aranıyor...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#E88080]/30 bg-[#E88080]/10 p-5 text-center text-[#E88080]">
                <p className="text-sm font-medium">
                  Hata: {error}
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && houses.length === 0 && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[#2B3747] bg-[#161F2B]/40 p-10 text-center">
                <SearchX
                  size={42}
                  className="mb-4 text-[#667384]"
                />

                <h3 className="text-lg font-semibold text-[#EDEFF2]">
                  İlan Bulunamadı
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8B95A3]">
                  Filtrelerinize uygun ev bulunamadı.
                  Filtreleri değiştirerek tekrar deneyebilirsiniz.
                </p>
              </div>
            )}

            {/* House Grid - Geniş ekranlar için kolon sayıları artırıldı */}
            {!loading && !error && houses.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {houses.map((house) => (
                  <Link
                    to={`/house/${house.id}`}
                    key={house.id}
                    className="group min-w-0"
                  >
                    <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#232E3D] bg-[#161F2B] transition-all duration-300 group-hover:border-[#4A5568] group-hover:shadow-lg group-hover:shadow-black/10">
                      <img
                        src={
                          house.imageUrl ||
                          defaultImages[Math.floor(Math.random() * defaultImages.length)]
                        }
                        alt={house.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <h2
                      className="px-1 text-xs font-medium leading-5 text-[#8B95A3] transition-colors group-hover:text-[#E8A33D]"
                      title={house.title}
                    >
                      {formatTitle(house.title)}
                    </h2>

                    {/* Şehir ve Semt Bilgisi */}
                    {(house.city || house.district) && (
                      <p className="px-1 mt-0.5 text-[11px] text-[#667384]">
                        {[house.city, house.district].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}