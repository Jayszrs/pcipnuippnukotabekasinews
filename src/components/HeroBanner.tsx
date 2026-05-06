import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Instagram, Bell } from "lucide-react";

export const HeroBanner = () => {
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventPassed, setEventPassed] = useState(false);

  useEffect(() => {
    const fetchActiveBanner = async () => {
      const { data } = await supabase
        .from("featured_events")
        .select("*")
        .eq("is_active", true)
        .limit(1);
      
      if (data && data.length > 0) {
        setActiveEvent(data[0]);
      }
    };
    fetchActiveBanner();
  }, []);

  useEffect(() => {
    if (!activeEvent) return;

    const interval = setInterval(() => {
      const targetDate = new Date(activeEvent.event_date).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setEventPassed(true);
        clearInterval(interval);
      } else {
        setEventPassed(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEvent]);

  if (!activeEvent) return null; // Sembunyikan section jika tidak ada banner aktif

  return (
    <div className="w-full bg-background mb-10 animate-in fade-in duration-1000">
      {/* CONTAINER BANNER UTAMA */}
      <div className="container-news relative w-full aspect-[8/2.2] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 group border border-border">
        {/* Gambar Banner Raksasa */}
        <img 
          src={activeEvent.banner_url} 
          alt={activeEvent.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
        />

        {/* OVERLAY GLASSMORPHISM UNTUK COUNTDOWN & REDIRECT BUTTON */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-between p-6 md:p-10 text-white">
          
          {/* Label Informasi Atas */}
          <div className="flex items-center gap-2 bg-[#03441b]/90 border border-emerald-500/30 backdrop-blur-md px-4 py-1.5 rounded-full w-fit shadow-lg animate-pulse">
            <Bell className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] md:text-xs font-brand font-black uppercase tracking-widest text-gold">EVENT MENDATANG</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {/* BOX COUNTDOWN BOX DYNAMIC */}
            <div className="space-y-2">
              <p className="text-[10px] md:text-xs font-brand font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> HITUNG MUNDUR ACARA:
              </p>
              
              {eventPassed ? (
                <div className="bg-amber-500/90 text-primary-deep px-5 py-2 rounded-xl font-brand font-black text-sm uppercase tracking-wider shadow-md w-fit">
                  Acara Sedang Berlangsung / Selesai
                </div>
              ) : (
                <div className="flex gap-2 md:gap-3 font-brand">
                  {/* Item Box */}
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds }
                  ].map((t, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-black/50 border border-white/10 backdrop-blur-md min-w-[50px] md:min-w-[65px] py-1.5 md:py-2.5 rounded-2xl shadow-inner">
                      <span className="text-lg md:text-2xl font-black text-amber-400 leading-none">{String(t.value).padStart(2, '0')}</span>
                      <span className="text-[8px] md:text-[9px] text-slate-300 font-bold uppercase tracking-tighter mt-1">{t.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTON LINK REDIRECT INSTAGRAM (HREF) */}
            {activeEvent.instagram_url && (
              <a 
                href={activeEvent.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#03441b] rounded-2xl font-brand font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-400/20 active:scale-95 h-fit w-full md:w-auto"
              >
                <Instagram className="h-4 w-4 font-black" /> Lihat Poster Instagram
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};