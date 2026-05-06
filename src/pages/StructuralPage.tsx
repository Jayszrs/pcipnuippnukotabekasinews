import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Quote, MapPin, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Komponen sub-card untuk menghandle state flip masing-masing kader
const CadreCard = ({ kader }: { kader: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="w-full aspect-[4/5] cursor-pointer [perspective:1000px] group select-none"
    >
      {/* Container Card yang Berputar */}
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* ================= BAGIAN DEPAN (FULL IMAGE DESAIN LU) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-xl [backface-visibility:hidden] z-20">
          {kader.image_url ? (
            <img 
              src={kader.image_url} 
              alt={kader.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-deep flex flex-col items-center justify-center p-6 text-white text-center">
              <span className="text-4xl font-black mb-2">NU</span>
              <p className="font-bold uppercase text-xs tracking-widest">{kader.name}</p>
              <p className="text-[10px] text-gold uppercase mt-1">{kader.position}</p>
            </div>
          )}
        </div>

        {/* ================= BAGIAN BELAKANG (BIODATA & QUOTE) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] p-8 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/60 border border-emerald-200/60 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] z-10 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black tracking-widest uppercase rounded-full">
                {kader.organization || "IPNU"}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Khidmah {kader.period_start}—{kader.period_end}
              </span>
            </div>

            {/* Nama & Jabatan */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight">
                {kader.name}
              </h3>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                {kader.position}
              </p>
              <div className="h-1 w-12 bg-gold rounded-full mt-2"></div>
            </div>

            {/* Detail Biodata */}
            <div className="space-y-3 pt-4 text-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-slate-100">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Asal / Pimpinan</p>
                  <p className="text-xs font-bold text-slate-700">{kader.origin || "Kota Bekasi"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-slate-100">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tempat, Tanggal Lahir</p>
                  <p className="text-xs font-bold text-slate-700">{kader.birth_info || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-slate-100">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Departemen / Divisi</p>
                  <p className="text-xs font-bold text-slate-700">{kader.division || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="border-t border-emerald-200/50 pt-4 text-center">
            <Quote className="h-4 w-4 text-primary/20 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-slate-600 italic leading-relaxed line-clamp-3">
              "{kader.quote || "Belajar, Berjuang, Bertaqwa."}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

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
    <div className="container-news py-12 min-h-screen bg-white animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto px-4">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-all mb-12 font-bold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <div className="text-center mb-24 space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tighter">
            Struktural Pimpinan Cabang
          </h1>
          {/* DI SINI SUDAH TERUPDATE MENJADI 2025 - 2028 */}
          <p className="text-muted-foreground font-bold uppercase tracking-[0.4em] text-[10px]">
            Masa Khidmah 2025 — 2028
          </p>
          <div className="h-1.5 w-20 bg-gold mx-auto rounded-full shadow-sm"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {cadres.map((kader) => (
            <CadreCard key={kader.id} kader={kader} />
          ))}
        </div>
      </div>
    </div>
  );
};