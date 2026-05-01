import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

export const StructuralPage = () => {
  const [cadres, setCadres] = useState<any[]>([]);

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
    <div className="container-news py-20 bg-slate-50 min-h-screen">
      {/* Header Halaman */}
      <div className="text-center mb-20 space-y-3">
        <h1 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tight">
          Struktural Pimpinan Cabang
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs">
          Masa Khidmah 2025 — 2027
        </p>
        <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-sm"></div>
      </div>

      {/* Grid Struktural */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
        {cadres.map((kader) => (
          <div key={kader.id} className="group relative flex flex-col items-center">
            
            {/* Auto-Template Card Container */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:-translate-y-4">
              
              {/* 1. Background Template (Aksen Hijau IPNU) */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary-deep flex items-end justify-center overflow-hidden">
                {/* Watermark Dekoratif */}
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[12rem] font-black text-white/5 opacity-10 select-none">
                  NU
                </span>
              </div>

              {/* 2. Foto Kader (Mendukung PNG Transparan) */}
              <img 
                src={kader.image_url || "/placeholder.svg"} 
                alt={kader.name}
                className="absolute inset-0 w-full h-full object-cover object-top drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* 3. Overlay Gradasi untuk Keterbacaan Teks */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* 4. Konten Teks di dalam Card */}
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase leading-none drop-shadow-lg">
                    {kader.name}
                  </h3>
                  <div className="h-1 w-10 bg-gold my-2"></div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                    {kader.position}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Quote Section (Muncul di bawah Card) */}
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
  );
};