import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const StructuralPage = () => {
  const [cadres, setCadres] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.from("cadres").select("*").order("order_priority", { ascending: true });
      if (data) setCadres(data);
    };
    loadData();
  }, []);

  return (
    <div className="container-news py-16 bg-[#F8FAFC]">
      <div className="text-center mb-16 space-y-2">
        <h1 className="text-4xl font-display font-black text-primary uppercase">Struktural Pimpinan Cabang</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Masa Khidmah 2025 — 2027</p>
        <div className="h-1 w-20 bg-gold mx-auto rounded-full"></div>
      </div>

      {/* Grid Utama Sesuai Gambar Referensi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {cadres.map((kader) => (
          <div key={kader.id} className="relative group overflow-hidden bg-white shadow-xl hover:-translate-y-2 transition-all duration-500 border-b-4 border-primary">
            {/* Image Portrait */}
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={kader.image_url || "/placeholder.svg"} 
                alt={kader.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Info Overlay Sesuai Gaya Gambar */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent text-white">
              <div className="relative z-10">
                <h3 className="text-2xl font-black leading-tight uppercase mb-1 drop-shadow-md">
                  {kader.name}
                </h3>
                <div className="h-0.5 w-8 bg-gold mb-2"></div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-90 text-gold-foreground">
                  {kader.position}
                </p>
                <p className="text-[8px] tracking-widest uppercase opacity-70 mt-1">
                  {kader.division}
                </p>
              </div>
            </div>

            {/* Efek Hover Glassmorphism */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
};