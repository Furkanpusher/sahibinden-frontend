import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Car, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { postListing } from "../api";

const TRANSMISSION_OPTIONS = ["manuel", "otomatik", "yarı otomatik"];
const FUEL_OPTIONS = ["Benzin", "Dizel", "LPG", "Elektrik", "Hibrit"];
const BODY_OPTIONS = ["Sedan", "Hatchback", "SUV", "Pickup", "Minivan", "Coupe", "Cabrio"];

export default function CreateCarPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: "success"|"error", message: "..." }

  const [form, setForm] = useState({
    title: "", city: "", district: "", price: "", listing_date: "",
    brand: "", series: "", model: "", year: "", km: "",
    transmission_type: "", fuel_type: "", body_type: "", color: "",
    engine_size: "", engine_power: "", traction: "", car_status: "", // "status" → "car_status" (çakışma önlendi)
    avg_fuel_consumption: "", fuel_tank: "", changed_parts: "",
    from_whom: "", tramer: "", for_trade: false,
  });

  const handleChange = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    // Boş string olan alanları null yap, car_status → status olarak gönder
    const { car_status, ...rest } = form;
    const payload = Object.fromEntries(
      Object.entries({ ...rest, status: car_status }).map(([k, v]) => [k, v === "" ? null : v])
    );

    try {
      await postListing("/all-cars/", payload);
      setAlert({ type: "success", message: "İlan başarıyla oluşturuldu!" });
      setTimeout(() => navigate("/all-cars"), 1200);
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1720] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/all-cars" className="group mb-6 inline-flex items-center gap-1.5 text-sm text-[#8B95A3] hover:text-[#EDEFF2] transition-colors">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Araç İlanları
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8A33D]/10">
            <Car size={20} className="text-[#E8A33D]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#EDEFF2]">Araç İlanı Oluştur</h1>
            <p className="text-sm text-[#667384]">Aracının bilgilerini eksiksiz doldur</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Temel Bilgiler">
            <Field label="İlan Başlığı *">
              <input type="text" placeholder="2020 VW Polo 1.0 TSI" value={form.title} onChange={handleChange("title")} required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fiyat (₺) *">
                <input type="number" placeholder="850000" value={form.price} onChange={handleChange("price")} required />
              </Field>
              <Field label="İlan Tarihi">
                <input type="date" value={form.listing_date} onChange={handleChange("listing_date")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Şehir"><input placeholder="Ankara" value={form.city} onChange={handleChange("city")} /></Field>
              <Field label="İlçe"><input placeholder="Çankaya" value={form.district} onChange={handleChange("district")} /></Field>
            </div>
          </Section>

          <Section title="Araç Bilgileri">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Marka *"><input placeholder="Volkswagen" value={form.brand} onChange={handleChange("brand")} required /></Field>
              <Field label="Seri"><input placeholder="Polo" value={form.series} onChange={handleChange("series")} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Model *"><input placeholder="1.0 TSI Highline" value={form.model} onChange={handleChange("model")} required /></Field>
              <Field label="Yıl"><input type="number" placeholder="2020" value={form.year} onChange={handleChange("year")} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Kilometre"><input type="number" placeholder="45000" value={form.km} onChange={handleChange("km")} /></Field>
              <Field label="Renk"><input placeholder="Beyaz" value={form.color} onChange={handleChange("color")} /></Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Vites">
                <select value={form.transmission_type} onChange={handleChange("transmission_type")}>
                  <option value="">Seç</option>
                  {TRANSMISSION_OPTIONS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Yakıt">
                <select value={form.fuel_type} onChange={handleChange("fuel_type")}>
                  <option value="">Seç</option>
                  {FUEL_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Kasa">
                <select value={form.body_type} onChange={handleChange("body_type")}>
                  <option value="">Seç</option>
                  {BODY_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Teknik Detaylar">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Motor Hacmi"><input placeholder="1.0" value={form.engine_size} onChange={handleChange("engine_size")} /></Field>
              <Field label="Motor Gücü (HP)"><input placeholder="110" value={form.engine_power} onChange={handleChange("engine_power")} /></Field>
              <Field label="Çekiş"><input placeholder="Önden çekiş" value={form.traction} onChange={handleChange("traction")} /></Field>
              <Field label="Araç Durumu"><input placeholder="İkinci el" value={form.car_status} onChange={handleChange("car_status")} /></Field>
              <Field label="Ort. Yakıt (L/100km)"><input placeholder="5.4" value={form.avg_fuel_consumption} onChange={handleChange("avg_fuel_consumption")} /></Field>
              <Field label="Yakıt Deposu (L)"><input placeholder="40" value={form.fuel_tank} onChange={handleChange("fuel_tank")} /></Field>
            </div>
            <Field label="Değişen Parçalar">
              <input placeholder="Ön tampon, sağ ön kapı" value={form.changed_parts} onChange={handleChange("changed_parts")} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tramer (₺)"><input type="number" placeholder="0" value={form.tramer} onChange={handleChange("tramer")} /></Field>
              <Field label="Kimden"><input placeholder="Galeriden / Sahibinden" value={form.from_whom} onChange={handleChange("from_whom")} /></Field>
            </div>
            <label className="flex cursor-pointer items-center gap-2 select-none">
              <input type="checkbox" checked={form.for_trade} onChange={handleChange("for_trade")} className="h-4 w-4 accent-[#E8A33D]" />
              <span className="text-sm text-[#8B95A3]">Takasa uygun</span>
            </label>
          </Section>

          {/* Alert — null guard burada, içeride kesinlikle null olmaz */}
          {alert !== null && (
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
              alert.type === "success"
                ? "border-[#2B5240] bg-[#1B3A2E] text-[#6FCF97]"
                : "border-[#522B2B] bg-[#3A1B1B] text-[#E88080]"
            }`}>
              {alert.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{alert.message}</span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[#E8A33D] py-3 text-sm font-semibold text-[#0F1720] transition-colors hover:bg-[#F0B058] disabled:opacity-50">
            {loading
              ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Gönderiliyor...</span>
              : "İlanı Yayınla"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-[#232E3D] bg-[#161F2B] p-5">
      <h2 className="mb-4 border-b border-[#232E3D] pb-3 text-sm font-semibold text-[#EDEFF2]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#8B95A3]">{label}</span>
      <div className="
        [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-[#232E3D]
        [&>input]:bg-[#0F1720] [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm
        [&>input]:text-[#EDEFF2] [&>input]:placeholder-[#4A5568] [&>input]:outline-none
        [&>input]:focus:border-[#E8A33D] [&>input]:transition-colors
        [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-[#232E3D]
        [&>select]:bg-[#0F1720] [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm
        [&>select]:text-[#EDEFF2] [&>select]:outline-none [&>select]:focus:border-[#E8A33D]
      ">
        {children}
      </div>
    </label>
  );
}
