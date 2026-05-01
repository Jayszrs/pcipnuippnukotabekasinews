import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote, ArrowLeft } from "lucide-react";
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
        
        {/* Tombol Kembali - Biar navigasinya gampang */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-colors mb-10 font-bold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        {/* Header Halaman */}
        <div className="text-center mb-20 space-y-3">
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tight">
            Struktural Pimpinan Cabang
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">
            Masa Khidmah 2025 — 2027
          </p>
          <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-sm"></div>
        </div>

        {/* Grid Struktural */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {cadres.map((kader) => (
            <div key={kader.id} className="group relative flex flex-col items-center">
              
              {/* Auto-Template Card Container */}
              {/* 'isolate' memastikan stacking context z-index di dalam sini rapi */}
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:-translate-y-4 bg-primary-deep isolate">
                
                {/* 1. Background Warna & Pattern (Layer Paling Belakang) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-deep z-0"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-10">
                  <span className="text-[12rem] font-black text-white select-none">NU</span>
                </div>

                {/* 2. Foto Kader (Layer Tengah) */}
                {/* Kita kasih z-20 biar pasti di depan background hijau */}
                {kader.image_url ? (
                  <img 
                    src={kader.image_url} 
                    alt={kader.name}
                    className="absolute inset-0 w-full h-full object-cover object-top drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 z-20"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <span className="text-white/20 text-xs italic">Foto tidak tersedia</span>
                  </div>
                )}

                {/* 3. Overlay Gradasi Hitam (Layer Atas Foto) */}
                {/* z-30 biar teks di depannya (z-40) tetap kelihatan kontras */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-30"></div>

                {/* 4. Konten Teks (Layer Paling Depan) */}
                <div className="absolute inset-x-0 bottom-0 p-8 text-white z-40">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase leading-tight drop-shadow-lg">
                      {kader.name}
                    </h3>
                    <div className="h-1 w-10 bg-gold my-2"></div>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                      {kader.position}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Quote Section (Di bawah Card) */}
              <div className="mt-6 text-center max-w-[90%] animate-in fade-in slide-in-from-top-2 duration-700">
                <div className="flex justify-center mb-2">
                  <Quote className="h-4 w-4 text-primary/30" />
                </div>
                <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                  "{kader.quote || "Belajar, Berjuang, Bertaqwa."}"
                </p>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-3">
                  — {kader.division}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};