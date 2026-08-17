import { Car, Home as HomeIcon, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const isStaff = localStorage.getItem("is_staff") === "true";

  return (
    <div className="min-h-screen bg-[#0F1720] text-[#EDEFF2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-center">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8A33D] text-base font-bold text-[#0F1720] shadow-lg shadow-[#E8A33D]/10">
              İ
            </div>
            <span className="text-xl font-bold tracking-tight text-[#EDEFF2]">
              İlanPazarı
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#EDEFF2] sm:text-4xl lg:text-5xl">
            Ne arıyorsun?
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8B95A3] sm:text-base">
            Aradığın kategoriyi seç, ilanlar arasında filtreleyerek ihtiyacına uygun ilanları kolayca bul.
          </p>

          {/* 🛡️ Sadece Staff ise görünen minik link */}
          {isStaff && (
            <div className="mt-4">
              <Link
                to="/staff/reports"
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <ShieldAlert size={15} />
                Moderasyon Paneli (Şikayet Edilen İlanlar)
              </Link>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          <CategoryCard
            to="/all-cars"
            icon={<Car size={28} />}
            title="Araç İlanları"
            desc="Marka, model, vites tipi, fiyat ve konuma göre araçları filtrele."
          />

          <CategoryCard
            to="/all-houses"
            icon={<HomeIcon size={28} />}
            title="Ev İlanları"
            desc="Oda sayısı, fiyat aralığı ve konuma göre ev ilanlarını keşfet."
          />
        </div>

        {/* Footer hint */}
        <div className="mt-10 text-center text-xs text-[#4A5568]">
          İhtiyacın olan ilanı hızlıca bul.
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-[#232E3D] bg-[#161F2B] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#E8A33D]/60 hover:bg-[#192431] hover:shadow-xl hover:shadow-black/20 sm:p-7"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1C2733] text-[#E8A33D] transition-colors duration-300 group-hover:bg-[#E8A33D] group-hover:text-[#0F1720]">
        {icon}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#EDEFF2]">
            {title}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#8B95A3]">
            {desc}
          </p>
        </div>

        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#232E3D] text-[#4A5568] transition-all duration-300 group-hover:border-[#E8A33D]/40 group-hover:text-[#E8A33D]">
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
