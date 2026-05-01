import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StructuralPage = () => {
  const [cadres, setCadres] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      // Mengambil data kader dan mengurutkannya berdasarkan prioritas
      const { data } = await supabase
        .from("cadres")
        .select("*")
        .order("order_priority", { ascending: true });
      if (data) setCadres(data);
    };
    loadData();
  }, []);

  return (
    <div className="container-news py-10 min-h-screen bg-white animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Tombol Kembali dengan Efek Hover */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-all mb-10 font-bold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        {/* Header Halaman - Lebih Elegan */}
        <div className="text-center mb-20 space-y-3">
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tight">
            Struktural Pimpinan Cabang
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">
            Masa Khidmah 2025 — 2027
          </p>
          <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-md"></div>
        </div>

        {/* Grid Struktural - 3 Kolom di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {cadres.map((kader) => (
            <div key={kader.id} className="group relative flex flex-col items-center">
              
              {/* PREMIUM CARD TEMPLATE */}
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)] bg-primary-deep isolate border border-white/10">
                
                {/* 1. Background Gradient & Glow (Layer 0) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-black z-0"></div>
                
                {/* 2. Watermark NU dengan Soft Glow (Layer 1) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-10">
                  <span className="text-[14rem] font-black text-gold/20 select-none blur-[1px]">NU</span>
                </div>

                {/* 3. Foto Kader (Layer 2) */}
                {kader.image_url ? (
                  <img 
                    src={kader.image_url} 
                    alt={kader.name}
                    className="relative z-20 w-full h-full object-cover object-top drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <span className="text-white/20 text-xs italic">Foto tidak tersedia</span>
                  </div>
                )}

                {/* 4. Glassmorphism Info Panel (Layer 3 & 4) */}
                <div className="absolute inset-x-0 bottom-0 p-8 z-40 bg-gradient-to-t from-black via-black/60 to-transparent backdrop-blur-[2px]">
                  <div className="space-y-1 transform transition-transform duration-500 group-hover:translate-y-[-5px]">
                    <h3 className="text-2xl font-black uppercase leading-tight text-white drop-shadow-lg">
                      {kader.name}
                    </h3>
                    <div className="h-1 w-12 bg-gold my-3 rounded-full"></div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                        {kader.position}
                      </p>
                      {/* Badge Organisasi Kecil */}
                      <span className="flex items-center gap-1 text-[8px] bg-white/10 px-2 py-1 rounded-full text-white/60 border border-white/5 uppercase font-bold tracking-tighter">
                        <ShieldCheck className="h-2 w-2 text-gold" /> PC KOTA BEKASI
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Quote Section (Di bawah Card) */}
              <div className="mt-8 text-center max-w-[85%] animate-in fade-in slide-in-from-top-2 duration-700">
                <div className="flex justify-center mb-3">
                  <Quote className="h-5 w-5 text-gold/30" />
                </div>
                <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
                  "{kader.quote || "Belajar, Berjuang, Bertaqwa."}"
                </p>
                
                {/* Divider Bidang */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="h-[1px] w-6 bg-slate-200"></div>
                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">
                    {kader.division}
                  </p>
                  <div className="h-[1px] w-6 bg-slate-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};