import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Award, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  Heart,
  Sparkles
} from "lucide-react";

interface Cadre {
  id: string;
  name: string;
  position: string;
  org_type: "IPNU" | "IPPNU";
  position_level: number; // 1: Ketua, 2: BPH, 3: Departemen
  sort_order: number;
  image_url: string | null;
}

export const StructuralPage = () => {
  const [activeTab, setActiveTab] = useState<"IPNU" | "IPPNU">("IPNU");
  const [cadres, setCadres] = useState<Cadre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Struktur Kepengurusan — PC IPNU IPPNU Kota Bekasi";
    fetchCadres();
  }, []);

  const fetchCadres = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadres")
        .select("*")
        .order("position_level", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCadres(data || []);
    } catch (err) {
      console.error("Gagal mengambil data struktural:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter pengurus berdasarkan organisasi & level hierarki
  const filteredCadres = cadres.filter(c => c.org_type === activeTab);
  const leader = filteredCadres.find(c => c.position_level === 1);
  const bph = filteredCadres.filter(c => c.position_level === 2);
  const departments = filteredCadres.filter(c => c.position_level === 3);

  // Komponen render kartu kader dengan tema plakat resmi (Sesuai gambar lu)
  const CadreCard = ({ cadre, size = "normal" }: { cadre: Cadre; size?: "large" | "normal" | "small" }) => {
    const isLarge = size === "large";
    const isSmall = size === "small";

    return (
      <div className={`relative group transition-all duration-500 hover:-translate-y-2 z-10 ${
        isLarge ? "w-72 sm:w-80" : isSmall ? "w-52" : "w-60 sm:w-64"
      }`}>
        {/* Frame Hijau Tua Khas NU dengan Glow Emas */}
        <div className="bg-[#03441b] rounded-[2rem] p-3 border-2 border-emerald-600/30 group-hover:border-gold/60 shadow-lg group-hover:shadow-gold/15 transition-all duration-500 flex flex-col items-center overflow-hidden">
          
          {/* Logo Sudut Atas */}
          <div className="w-full flex justify-between px-3 pt-1 pb-2">
            <span className="text-[7px] text-emerald-400 font-black tracking-widest uppercase">PC {activeTab}</span>
            <span className="text-[7px] text-gold font-black tracking-widest uppercase">KOTA BEKASI</span>
          </div>

          {/* Bingkai Foto Bulat / Kotak Halus */}
          <div className={`relative rounded-2xl overflow-hidden bg-emerald-950/40 border border-white/10 flex items-end justify-center aspect-[3/4] w-full`}>
            {cadre.image_url ? (
              <img 
                src={cadre.image_url} 
                alt={cadre.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-900/40 text-emerald-300">
                <Users className="h-16 w-16 opacity-30" />
              </div>
            )}
            
            {/* Overlay Gradient Elegan */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Name Ribbon (Slanted / Miring Elegan) */}
          <div className="w-full mt-4 flex flex-col items-center">
            {/* Nama Kader */}
            <div className="w-[95%] bg-gold text-gold-foreground py-2 px-3 rounded-xl font-brand font-black text-xs md:text-sm uppercase tracking-wider text-center transform -skew-x-6 shadow-md transition-colors group-hover:bg-amber-400">
              <div className="transform skew-x-6 truncate">{cadre.name}</div>
            </div>
            {/* Jabatan Kepengurusan */}
            <div className="w-[85%] bg-white text-emerald-900 py-1 px-2 rounded-lg font-brand font-bold text-[9px] md:text-[10px] uppercase tracking-widest text-center mt-1.5 shadow-sm">
              {cadre.position}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="bg-primary-deep text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-5 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gold/80 hover:text-gold mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> KEMBALI KE BERANDA
          </Link>
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold text-[10px] font-black uppercase tracking-widest rounded-full">
              <Award className="h-3.5 w-3.5" /> Masa Khidmat 2025 — 2027
            </span>
            <h1 className="font-display font-black text-3xl lg:text-5xl uppercase tracking-tight italic">
              Struktur Kepengurusan PC {activeTab === "IPNU" ? "IPNU" : "IPPNU"}
            </h1>
            <p className="text-xs lg:text-sm text-primary-foreground/70 uppercase font-bold tracking-wider">
              Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama & Ikatan Pelajar Putri Nahdlatul Ulama Kota Bekasi
            </p>
          </div>
        </div>
      </header>

      {/* TAB SWITCHER */}
      <div className="flex justify-center mt-12 px-5">
        <div className="bg-slate-100 p-1.5 rounded-full flex items-center relative shadow-inner border">
          <button
            onClick={() => setActiveTab("IPNU")}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
              activeTab === "IPNU"
                ? "bg-[#03441b] text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" /> PC IPNU (Putera)
          </button>
          <button
            onClick={() => setActiveTab("IPPNU")}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
              activeTab === "IPPNU"
                ? "bg-gold text-gold-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="h-4 w-4" /> PC IPPNU (Putri)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="container mx-auto px-5 lg:px-8 mt-16 max-w-6xl relative z-10">
          
          {/* ======================================================== */}
          {/* LEVEL 1: KETUA (TOP OF THE TREE) */}
          {/* ======================================================== */}
          {leader && (
            <div className="flex flex-col items-center relative">
              <div className="text-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5 justify-center mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" /> Pimpinan Tertinggi
                </span>
              </div>
              <CadreCard cadre={leader} size="large" />
              
              {/* Garis Vertikal Utama Menurun Kebawah */}
              {(bph.length > 0 || departments.length > 0) && (
                <div className="w-0.5 h-16 bg-gradient-to-b from-gold/80 to-slate-200 mt-4"></div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* LEVEL 2: BADAN PENGURUS HARIAN (BPH) */}
          {/* ======================================================== */}
          {bph.length > 0 && (
            <div className="relative mt-2">
              
              {/* Garis Horizontal Penghubung BPH (Hanya tampil di Desktop) */}
              <div className="hidden md:block absolute top-0 left-12 right-12 h-0.5 bg-slate-200"></div>

              <div className="flex flex-wrap justify-center gap-8 lg:gap-12 pt-8">
                {bph.map((cadre) => (
                  <div key={cadre.id} className="flex flex-col items-center relative">
                    {/* Garis Vertikal Mini di atas setiap kartu BPH */}
                    <div className="hidden md:block absolute -top-8 w-0.5 h-8 bg-slate-200"></div>
                    <CadreCard cadre={cadre} />
                  </div>
                ))}
              </div>

              {/* Garis Pembatas Menuju Departemen */}
              {departments.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="w-0.5 h-16 bg-dashed bg-slate-200"></div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* LEVEL 3: DEPARTEMEN & LEMBAGA */}
          {/* ======================================================== */}
          {departments.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="font-display font-black text-lg lg:text-xl text-primary uppercase tracking-wider">
                  Departemen & Lembaga Pendukung
                </h3>
                <div className="h-1 w-12 bg-gold mx-auto mt-2 rounded-full"></div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {departments.map((cadre) => (
                  <CadreCard key={cadre.id} cadre={cadre} size="small" />
                ))}
              </div>
            </div>
          )}

          {filteredCadres.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-muted-foreground font-semibold">
              Belum ada data kepengurusan terdaftar untuk PC {activeTab}.
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default StructuralPage;