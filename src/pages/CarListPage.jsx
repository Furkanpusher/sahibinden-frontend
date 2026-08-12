import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
  SearchX,
} from "lucide-react";
import { fetchListings } from "../api";
import { FilterInput, FilterSelect } from "../components/ListingUI";

export default function CarListPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    brand: "",
    transmission_type: "",
    price_min: "",
    price_max: "",
    location: "",
  });

  const defaultImages = [ // arabar esimlerim
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

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchListings("/all-cars/", filters)
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleChange = (field) => (e) =>
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

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

                <FilterInput
                  label="Marka"
                  placeholder="Örn: Renault"
                  value={filters.brand}
                  onChange={handleChange("brand")}
                />

                <FilterSelect
                  label="Vites Tipi"
                  value={filters.transmission_type}
                  onChange={handleChange("transmission_type")}
                >
                  <option value="">Hepsi</option>
                  <option value="Düz">Manuel</option>
                  <option value="Otomatik">Otomatik</option>
                  <option value="Yarı Otomatik">
                    Yarı Otomatik
                  </option>
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

                <FilterInput
                  label="Konum"
                  placeholder="Örn: Ankara"
                  value={filters.location}
                  onChange={handleChange("location")}
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
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {cars.map((car) => (
                  <Link
                    to={`/car/${car.id}`} // tıkladığı arabayı id'si ile detay sayfasına yönlendiriyor
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
