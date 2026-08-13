import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom"; // useSearchParams eklendi
import {
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
  SearchX,
} from "lucide-react";
import { fetchListings } from "../api";
import { FilterInput, FilterSelect } from "../components/ListingUI"; // hem input alabilcem hemde dropdowni çin select

export default function CarListPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL'DEKİ PARAMETRELERİ YAKALAR!
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtreleri başlangıçta URL'den okuyoruz
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    transmission_type: searchParams.get("transmission_type") || "",
    price_min: searchParams.get("price_min") || "",
    price_max: searchParams.get("price_max") || "",
    city: searchParams.get("city") || "",
    district: searchParams.get("district") || "",
  });


  const [options, setOptions] = useState({ // car için backendden gelcek dropdown seçenekleri
  cities: [],
  districts: [],
  brands: [],
  transmissions: [],
});

  const defaultImages = [
    "/car-1.jpg",
    "/car-2.jpg",
    "/car-3.jpg",
    "/car-4.jpg",
    "/car-5.jpg",
    "/car-6.jpg",
    "/car-7.jpg",
    "/car-8.jpg",
    "/car-9.jpg",
    "/car-10.jpg",
  ];

  useEffect(() => { // Tüm arabaları göstercek
    setLoading(true);
    setError(null);

    fetchListings("/all-cars/", filters)  
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);


  useEffect(() => { // araba optionları seçen 
  const params = filters.city ? { city: filters.city } : {};
  fetchListings("/car-options/", params)
    .then((data) => {
      setOptions({
        cities: data.cities || [],
        districts: data.districts || [],
        brands: data.brands || [],
        transmissions: data.transmissions || [],
      });
    })
    .catch((err) => console.error("Filtre seçenekleri alınamadı:", err));
}, [filters.city]);

  // Inputlar değiştikçe hem state'i hem de tarayıcı URL'ini güncelliyoruz
  const handleChange = (field) => (e) => {
  const newValue = e.target.value;
  setFilters((prev) => {
    const updated = {
      ...prev,
      [field]: newValue,
      ...(field === "city" ? { district: "" } : {}), // citye göre maplicek distrciti
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
                Araç İlanları
              </h1>

              <p className="mt-1 text-sm text-[#667384]">
                Aradığın aracı filtreleyerek hızlıca bul.
              </p>
            </div>

            {!loading && cars.length > 0 && (
              <span className="w-fit rounded-lg border border-[#232E3D] bg-[#161F2B] px-3 py-1.5 text-xs font-medium text-[#8B95A3]">
                {cars.length} sonuç
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

                {/* Marka Dropdown */}
                <FilterSelect label="Marka" value={filters.brand} onChange={handleChange("brand")}>
                  <option value="">Tüm Markalar</option>
                  {options.brands.map((b) => {
                    const val = typeof b === "object" ? b.name : b;
                    const countStr = typeof b === "object" && b.count ? ` (${b.count})` : "";
                    return <option key={val} value={val}>{val}{countStr}</option>;
                  })}
                </FilterSelect>

                {/* Şehir Dropdown */}
                <FilterSelect label="Şehir" value={filters.city} onChange={handleChange("city")}>
                  <option value="">Tüm Şehirler</option>
                  {options.cities.map((c) => {
                    const val = typeof c === "object" ? c.name : c;
                    const countStr = typeof c === "object" && c.count ? ` (${c.count})` : "";
                    return <option key={val} value={val}>{val}{countStr}</option>;
                  })}
                </FilterSelect>
                
                {/* Vites Tipi Dropdown */}
                <FilterSelect label="Vites Tipi" value={filters.transmission_type} onChange={handleChange("transmission_type")}>
                  <option value="">Tüm Vites Tipleri</option>
                  {options.transmissions.map((t) => {
                    const val = typeof t === "object" ? t.name : t;
                    const countStr = typeof t === "object" && t.count ? ` (${t.count})` : "";
                    return <option key={val} value={val}>{val}{countStr}</option>;
                  })}
                </FilterSelect>


                  {/* Semt / İlçe Dropdown */}
                  <FilterSelect label="Semt / İlçe" value={filters.district} onChange={handleChange("district")}>
                    <option value="">Tüm İlçeler</option>
                    {options.districts.map((d) => {
                      const val = typeof d === "object" ? d.name : d;
                      const countStr = typeof d === "object" && d.count ? ` (${d.count})` : "";
                      return <option key={val} value={val}>{val}{countStr}</option>;
                    })}
                  </FilterSelect>

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
            {!loading && !error && cars.length === 0 && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[#2B3747] bg-[#161F2B]/40 p-10 text-center">
                <SearchX
                  size={42}
                  className="mb-4 text-[#667384]"
                />

                <h3 className="text-lg font-semibold text-[#EDEFF2]">
                  İlan Bulunamadı
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8B95A3]">
                  Filtrelerinize uygun araç bulunamadı.
                  Filtreleri değiştirerek tekrar deneyebilirsiniz.
                </p>
              </div>
            )}

            {/* Car Grid */}
            {!loading && !error && cars.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {cars.map((car) => (
                  <Link
                    to={`/car/${car.id}`}
                    key={car.id}
                    className="group min-w-0"
                  >
                    <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#232E3D] bg-[#161F2B] transition-all duration-300 group-hover:border-[#4A5568] group-hover:shadow-lg group-hover:shadow-black/10">
                      <img
                        src={
                          car.imageUrl ||
                          defaultImages[Math.floor(Math.random() * defaultImages.length)]
                        }
                        alt={car.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <h2
                      className="px-1 text-xs font-medium leading-5 text-[#8B95A3] transition-colors group-hover:text-[#E8A33D]"
                      title={car.title}
                    >
                      {formatTitle(car.title)}
                    </h2>
                    {(car.city || car.district) && (
                    <p className="px-1 mt-0.5 text-[11px] text-[#667384]">
                      {[car.city, car.district].filter(Boolean).join(", ")}
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