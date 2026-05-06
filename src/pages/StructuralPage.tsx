import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Quote, MapPin, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header"; // <-- Pastikan path import Header asli lu bener
import { Footer } from "@/components/Footer"; // <-- Pastikan path import Footer asli lu bener

// ================= KOMPONEN KARTU KADER (3D FLIP EFFECT) =================
const CadreCard = ({ kader }: { kader: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="w-full aspect-[4/5] cursor-pointer [perspective:1000px] group select-none"
    >
      {/* Container Card yang Berputar */}
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* ================= BAGIAN DEPAN (FULL IMAGE DESAIN CANVA LU) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-xl [backface-visibility:hidden] z-20 border border-border bg-muted">
          {kader.image_url ? (
            <img 
              src={kader.image_url} 
              alt={kader.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-deep flex flex-col items-center justify-center p-6 text-primary-foreground text-center">
              <span className="text-4xl font-brand font-black mb-2 opacity-25">NU</span>
              <p className="font-brand font-black uppercase text-sm tracking-tight">{kader.name}</p>
              <p className="text-[10px] text-gold font-bold uppercase mt-1 tracking-widest">{kader.position}</p>
            </div>
          )}
        </div>

        {/* ================= BAGIAN BELAKANG (BIODATA & GRADIASI SEMPURNA) ================= */}
        {/* INI PERBAIKANNYA LAN! Pake gradiasi emerald ijo muda ke putih bersih di paling bawah */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] p-8 bg-gradient-to-br from-emerald-100/70 via-white to-white border border-emerald-200/50 shadow-2xl shadow-emerald-950/5 [backface-visibility:hidden] [transform:rotateY(180deg)] z-10 flex flex-col justify-between overflow-hidden">
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-brand font-black tracking-widest uppercase rounded-full shrink-0 z-10">
                {kader.organization || "IPNU"}
              </span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider shrink-0 z-10">
                Khidmah {kader.period_start || "2025"}—{kader.period_end || "2028"}
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
                  <p className="text-xs font-bold text-foregroundleading-snug">{kader.birth_info || "-"}</p>
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
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase
        .from("cadres")
        .select("*")
        .order("order_priority", { ascending: true });
      if (data) setCadres(data);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-in fade-in duration-1000">
      {/* 1. RENDER HEADER ASLI LU */}
      <Header />

      {/* 2. AREA KONTEN TENGAH STRUKTURAL (Pake container-news bawaan lu biar simetris) */}
      <main className="container-news flex-grow py-12 bg-background">
        
        {/* Tombol Kembali Minimalis */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-all mb-12 font-brand font-black text-xs uppercase tracking-wider group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        {/* Heading Jajaran Struktural - Sesuai tema lu */}
        <div className="text-center mb-24 space-y-4 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-brand font-black text-primary uppercase tracking-tighter leading-none">
            Struktural Pimpinan Cabang
          </h1>
          <p className="text-muted-foreground font-brand font-black uppercase tracking-[0.4em] text-[10px]">
            Masa Khidmah 2025 — 2028
          </p>
          <div className="h-1.5 w-20 bg-gold mx-auto rounded-full shadow-sm" />
        </div>

        {/* Display Grid List Kartu Pengurus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {cadres.map((kader) => (
            <CadreCard key={kader.id} kader={kader} />
          ))}
        </div>
      </main>

      {/* 3. RENDER FOOTER ASLI LU */}
      <Footer />
    </div>
  );
};