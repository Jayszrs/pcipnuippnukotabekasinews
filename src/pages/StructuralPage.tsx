import { useEffect, useState } from "react";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { 
  ArrowLeft, 
  Quote, 
  MapPin, 
  Calendar, 
  Shield, 
  Users, 
  Sparkles, 
  Heart,
  Loader2 // <-- INI DIA YANG TADI KETINGGALAN LAN, BIAR GAK BLANK LAGI!
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer"; 
import structuralParallaxBg from "@/assets/hero-news.jpg";

const displayPeriodStart = (periodStart?: string | number | null) =>
  String(periodStart || "2026") === "2025" ? "2026" : String(periodStart || "2026");

// ================= KOMPONEN KARTU KADER (3D FLIP EFFECT) =================
const CadreCard = ({ kader }: { kader: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="w-full aspect-[4/5] cursor-pointer [perspective:1000px] group select-none max-w-[320px] mx-auto animate-in fade-in duration-500"
    >
      {/* Container Card yang Berputar */}
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* ================= BAGIAN DEPAN (FULL IMAGE DESAIN CANVA LU) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-xl [backface-visibility:hidden] z-20 border border-border bg-muted">
          {kader.image_url ? (
            <img 
              src={kader.image_url} 
              alt={`Pengurus Struktural PC IPNU IPPNU Kota Bekasi - ${kader.name}${kader.position ? ` (${kader.position})` : ""}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-[#03441b] flex flex-col items-center justify-center p-6 text-primary-foreground text-center">
              <span className="text-4xl font-brand font-black mb-2 opacity-25">NU</span>
              <p className="font-brand font-black uppercase text-sm tracking-tight">{kader.name}</p>
              <p className="text-[10px] text-gold font-bold uppercase mt-1 tracking-widest">{kader.position}</p>
            </div>
          )}
        </div>

        {/* ================= BAGIAN BELAKANG (BIODATA & GRADIASI SEMPURNA) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] p-8 bg-gradient-to-br from-emerald-100/70 via-white to-white border border-emerald-200/50 shadow-2xl shadow-emerald-950/5 [backface-visibility:hidden] [transform:rotateY(180deg)] z-10 flex flex-col justify-between overflow-hidden text-left">
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-brand font-black tracking-widest uppercase rounded-full shrink-0 z-10">
                {kader.organization || "IPNU"}
              </span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider shrink-0 z-10">
                Khidmah {displayPeriodStart(kader.period_start)}—{kader.period_end || "2028"}
              </span>
            </div>

            {/* Nama & Jabatan */}
            <div className="space-y-1 z-10">
              <h3 className="text-xl font-brand font-black text-foreground uppercase tracking-tight leading-none mb-1">
                {kader.name}
              </h3>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                {kader.position}
              </p>
              <div className="h-1 w-12 bg-gold rounded-full mt-2"></div>
            </div>

            {/* Detail Biodata Belakang */}
            <div className="space-y-3.5 pt-5 text-foreground/80 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-emerald-200/50 shrink-0">
                  <MapPin className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Asal / Pimpinan</p>
                  <p className="text-xs font-bold text-foreground leading-snug">{kader.origin || "Kota Bekasi"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-emerald-200/50 shrink-0">
                  <Calendar className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Tempat, Tanggal Lahir</p>
                  <p className="text-xs font-bold text-foreground leading-snug">{kader.birth_info || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-emerald-200/50 shrink-0">
                  <Shield className="h-4 w-4 shrink-0" />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Departemen / Divisi</p>
                  <p className="text-xs font-bold text-foreground leading-snug">{kader.division || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Quote */}
          <div className="border-t border-emerald-200/50 pt-4 text-center z-10">
            <Quote className="h-4 w-4 text-primary/20 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-muted-foreground italic leading-relaxed line-clamp-3 px-2">
              "{kader.quote || "Belajar, Berjuang, Bertaqwa."}"
            </p>
          </div>

          {/* Efek Glow Tipis di background belakang */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-60 z-0 translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-60 z-0 -translate-x-10 translate-y-10" />

        </div>
      </div>
    </div>
  );
};

// ================= COMPONENT UTAMA HALAMAN STRUKTURAL =================
export const StructuralPage = () => {
  const [cadres, setCadres] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"IPNU" | "IPPNU">("IPNU");
  const [loading, setLoading] = useState(true);
  const [parallaxY, setParallaxY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("cadres")
        .select("*")
        .order("position_level", { ascending: true })
        .order("order_priority", { ascending: true });
      if (data) setCadres(data);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setParallaxY(window.scrollY);
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Filter pengurus berdasarkan Organisasi Aktif (IPNU / IPPNU)
  const filteredCadres = cadres.filter(k => k.organization === activeTab);

  // Pisahkan pengurus ke masing-masing level bertingkat
  const leaders = filteredCadres.filter(k => k.position_level === 1);
  const bphList = filteredCadres.filter(k => k.position_level === 2);
  const departments = filteredCadres.filter(k => k.position_level === 3 || !k.position_level);
  const getParallaxOffset = (index: number, strength = 1) => {
    const rawOffset = (parallaxY - 260 - index * 180) * 0.032 * strength;
    return Math.max(-26, Math.min(26, rawOffset));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-in fade-in duration-1000">
      {/* 1. RENDER HEADER ASLI LU */}
      <Header />

      {/* 2. AREA KONTEN TENGAH STRUKTURAL */}
      <main className="relative z-10 flex-grow overflow-hidden bg-background py-12">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes structuralFloat {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
            50% { transform: translate3d(22px, -18px, 0) scale(1.08); opacity: 0.8; }
          }
          @keyframes structuralLineGlow {
            0%, 100% { filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
            50% { filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.45)); }
          }
          .structural-parallax-layer,
          .structural-parallax-card,
          .structural-parallax-title,
          .structural-parallax-line {
            will-change: transform;
          }
          .structural-parallax-stage {
            perspective: 1400px;
            transform-style: preserve-3d;
          }
          .structural-parallax-card {
            transform-style: preserve-3d;
            transition: transform 180ms linear;
          }
          .structural-card-depth {
            transform: translateZ(20px);
          }
          .structural-line-glow {
            animation: structuralLineGlow 3.5s ease-in-out infinite;
          }
          .structural-float {
            animation: structuralFloat 9s ease-in-out infinite;
          }
        `}} />

        <div
          className="structural-parallax-layer pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10"
          style={{ transform: `translate3d(0, ${Math.max(Math.min((parallaxY - 120) * -0.055, 38), -62)}px, 0) scale(1.04)` }}
          aria-hidden="true"
        >
          <img
            src={structuralParallaxBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.08] mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-50/80 to-background dark:via-emerald-950/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(3,68,27,0.12),transparent_24rem),radial-gradient(circle_at_82%_38%,rgba(255,215,0,0.14),transparent_22rem)]" />
          <div className="structural-float absolute left-[7%] top-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="structural-float absolute right-[8%] top-[34rem] h-96 w-96 rounded-full bg-gold/10 blur-3xl" style={{ animationDelay: "2s" }} />
          <div className="absolute left-1/2 top-52 -translate-x-1/2 select-none font-brand text-[8rem] font-black uppercase leading-none tracking-tight text-primary/[0.035] md:text-[13rem]">
            Struktural
          </div>
        </div>

        <div className="container-news structural-parallax-stage relative z-10">
        
        {/* Tombol Kembali Minimalis */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-all mb-12 font-brand font-black text-xs uppercase tracking-wider group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        {/* Heading Jajaran Struktural */}
        <div
          className="structural-parallax-title text-center mb-12 space-y-4 max-w-2xl mx-auto px-4"
          style={{ transform: `translate3d(0, ${Math.max(Math.min((parallaxY - 80) * -0.035, 18), -28)}px, 0)` }}
        >
          <h1 className="text-4xl md:text-5xl font-brand font-black text-primary uppercase tracking-tighter leading-none">
            Struktural Pimpinan Cabang
          </h1>
          <p className="text-muted-foreground font-brand font-black uppercase tracking-[0.4em] text-[10px]">
            Masa Khidmah 2026 — 2028
          </p>
          <div className="h-1.5 w-20 bg-gold mx-auto rounded-full shadow-sm" />
        </div>

        {/* TAB SWITCHER IPNU VS IPPNU (Mewah & Smooth) */}
        <div className="flex justify-center mb-16 px-4">
          <div className="bg-slate-100 p-1.5 rounded-full flex items-center relative shadow-inner border border-slate-200">
            <button
              onClick={() => setActiveTab("IPNU")}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                activeTab === "IPNU"
                  ? "bg-[#03441b] text-white shadow-lg animate-in fade-in"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" /> PC IPNU (Putera)
            </button>
            <button
              onClick={() => setActiveTab("IPPNU")}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                activeTab === "IPPNU"
                  ? "bg-gold text-gold-foreground shadow-lg animate-in fade-in"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="h-4 w-4" /> PC IPPNU (Putri)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-20">
            
            {/* ======================================================== */}
            {/* LEVEL 1: KETUA UMUM (POSISI TERATAS) */}
            {/* ======================================================== */}
            {leaders.length > 0 && (
              <div className="flex flex-col items-center relative">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5 justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" /> Pimpinan Utama
                  </span>
                </div>
                
                {/* Grid Ketua */}
                <div className="flex flex-wrap justify-center gap-8 w-full">
                  {leaders.map((kader, idx) => {
                    const offset = getParallaxOffset(idx, -0.7);
                    const tilt = Math.max(-2, Math.min(2, offset * 0.08));
                    return (
                    <div
                      key={kader.id}
                      className="structural-parallax-card structural-card-depth w-72 sm:w-80"
                      style={{ transform: `translate3d(0, ${offset}px, 0) rotateX(${tilt}deg)` }}
                    >
                      <CadreCard kader={kader} />
                    </div>
                  )})}
                </div>

                {/* Garis Vertikal Utama Penghubung Kebawah */}
                {(bphList.length > 0 || departments.length > 0) && (
                  <div className="structural-parallax-line structural-line-glow hidden md:block w-0.5 h-16 bg-gradient-to-b from-gold/80 to-slate-200 mt-8"></div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* LEVEL 2: BADAN PENGURUS HARIAN (BPH) */}
            {/* ======================================================== */}
            {bphList.length > 0 && (
              <div className="relative">
                {/* Garis Horizontal Penghubung jajaran BPH */}
                <div className="structural-parallax-line structural-line-glow hidden md:block absolute top-0 left-24 right-24 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                <div className="flex flex-wrap justify-center gap-10 pt-10">
                  {bphList.map((kader, idx) => {
                    const offset = getParallaxOffset(idx + 2, idx % 2 === 0 ? 0.55 : -0.45);
                    const tilt = Math.max(-2.4, Math.min(2.4, offset * -0.07));
                    return (
                    <div
                      key={kader.id}
                      className="structural-parallax-card structural-card-depth relative flex flex-col items-center w-64 sm:w-72"
                      style={{ transform: `translate3d(0, ${offset}px, 0) rotateX(${tilt}deg)` }}
                    >
                      {/* Garis Vertikal Mini di atas setiap kartu BPH */}
                      <div className="structural-line-glow hidden md:block absolute -top-10 w-0.5 h-10 bg-slate-200"></div>
                      <CadreCard kader={kader} />
                    </div>
                  )})}
                </div>

                {/* Garis Pembatas Menurun Menuju Departemen */}
                {departments.length > 0 && (
                  <div className="flex justify-center mt-16">
                    <div className="structural-line-glow w-0.5 h-16 bg-slate-200"></div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* LEVEL 3: DEPARTEMEN & ANGGOTA (GRID BAWAH) */}
            {/* ======================================================== */}
            {departments.length > 0 && (
              <div className="pt-4 animate-in fade-in duration-500">
                <div className="text-center mb-12">
                  <h3 className="font-brand font-black text-xl text-primary uppercase tracking-wider flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5 text-gold" /> Departemen & Lembaga
                  </h3>
                  <div className="h-1 w-12 bg-gold mx-auto mt-2 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                  {departments.map((kader, idx) => {
                    const offset = getParallaxOffset(idx + 4, idx % 3 === 0 ? -0.55 : idx % 3 === 1 ? 0.45 : -0.25);
                    const tilt = Math.max(-2, Math.min(2, offset * 0.06));
                    return (
                    <div
                      key={kader.id}
                      className="structural-parallax-card structural-card-depth"
                      style={{ transform: `translate3d(0, ${offset}px, 0) rotateX(${tilt}deg)` }}
                    >
                      <CadreCard kader={kader} />
                    </div>
                  )})}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredCadres.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-muted-foreground font-semibold">
                Belum ada data kepengurusan terdaftar untuk PC {activeTab}.
              </div>
            )}

          </div>
        )}

        </div>
      </main>

      {/* 3. RENDER FOOTER ASLI LU */}
      <Footer />
    </div>
  );
};

export default StructuralPage;
