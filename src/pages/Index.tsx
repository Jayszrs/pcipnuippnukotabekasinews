import { useEffect, useState } from "react";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { VideoHighlight } from "@/components/VideoHighlight";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { useArticles } from "@/contexts/ArticlesContext";
import { ArrowRight, Sparkles, Clock, Instagram, Bell, Loader2, Star } from "lucide-react"; // <-- IMPORT STAR DI SINI
import { Link } from "react-router-dom";
import { applyDefaultMeta } from "@/lib/seo";

// ================= COMPONENT DYNAMIC EVENT BANNER & COUNTDOWN =================
const HeroBannerLocal = () => {
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventPassed, setEventPassed] = useState(false);

  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("featured_events")
          .select("*")
          .eq("is_active", true)
          .limit(1);
        
        if (!error && data && data.length > 0) {
          setActiveEvent(data[0]);
        }
      } catch (err) {
        console.error("Gagal memuat banner event besar:", err);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="container-news mb-10">
        <div className="w-full min-h-[150px] bg-muted/60 border border-border rounded-[2.5rem] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
        </div>
      </div>
    );
  }

  if (!activeEvent) return null;

  return (
    <div className="w-full bg-background mb-10 animate-in fade-in duration-700">
      <div className="container-news relative w-full min-h-[320px] md:min-h-0 md:aspect-[8/2.2] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 group border border-border">
        
        {/* Gambar Spanduk 8x2 Pelantikan Dari Admin Panel */}
        <img 
          src={activeEvent.banner_url} 
          alt={`Banner kegiatan PC IPNU IPPNU Kota Bekasi - ${activeEvent.title}`} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
        />

        {/* Gradasi Proteksi Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50 md:bg-gradient-to-r md:from-black/75 md:via-black/30 md:to-transparent z-10" />

        {/* Konten Teks & Timer Real-time */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-10 text-white">
          
          <div className="flex items-center gap-2 bg-[#03441b]/95 border border-emerald-500/30 backdrop-blur-sm px-4 py-1.5 rounded-full w-fit shadow-lg">
            <Bell className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
            <span className="text-[10px] md:text-xs font-brand font-black uppercase tracking-widest text-amber-400">EVENT MENDATANG</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 md:pt-0">
            <div className="space-y-2.5">
              <p className="text-[10px] md:text-xs font-brand font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> HITUNG MUNDUR ACARA:
              </p>
              
              {eventPassed ? (
                <div className="bg-amber-400 text-[#03441b] px-5 py-2.5 rounded-xl font-brand font-black text-xs uppercase tracking-wider shadow-md w-fit">
                  🚀 Acara Sedang Berlangsung / Selesai
                </div>
              ) : (
                <div className="flex gap-2.5 md:gap-3 font-brand">
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds }
                  ].map((t, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-black/65 border border-white/10 backdrop-blur-sm min-w-[52px] sm:min-w-[58px] md:min-w-[65px] py-2 rounded-2xl shadow-lg">
                      <span className="text-xl md:text-2xl font-black text-amber-400 leading-none">
                        {String(t.value).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] md:text-[9px] text-slate-300 font-extrabold uppercase tracking-widest mt-1">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeEvent.instagram_url && (
              <a 
                href={activeEvent.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-amber-400 hover:bg-amber-300 text-[#03441b] rounded-2xl font-brand font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-400/20 active:scale-95 h-fit w-full md:w-auto shrink-0 text-center"
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

// ================= MAIN BERANDA PAGE =================
const Index = () => {
  const { articles } = useArticles();

  useEffect(() => {
    applyDefaultMeta();
  }, []);

  const latest = (articles || []).slice(1, 7);

  return (
    <Layout>
      {/* 1. Headline Utama Berita Slider */}
      <Hero />

      {/* 2. DYNAMIC COUNTDOWN BANNER */}
      <HeroBannerLocal />

      {/* 3. Berita Terbaru & Sidebar */}
      <section className="container-news py-10 lg:py-16 bg-background">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16">
          
          {/* KOLOM KIRI: BERITA TERBARU */}
          <div className="space-y-10">
            <div className="flex items-end justify-between border-b-2 border-primary pb-4">
              <div>
                <span className="inline-flex items-center gap-2 text-primary font-brand font-bold text-xs uppercase tracking-[0.2em] mb-2">
                  <Sparkles className="h-3 w-3" /> Terkini
                </span>
                <h2 className="font-display font-black text-3xl lg:text-4xl text-foreground uppercase italic">Berita Terbaru</h2>
              </div>
              <Link to="/kategori/kegiatan-ipnu" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all group">
                LIHAT SEMUA <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {latest.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-muted rounded-xl">
                <p className="text-muted-foreground font-medium italic">Belum ada berita yang diterbitkan.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                {latest.map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            )}
          </div>

          {/* KOLOM KANAN: SIDEBAR & INTERACTIVE RATINGS LINK */}
          <div className="space-y-8">
            <Sidebar />

            {/* BANNER AJAKAN RATING LAYANAN PUBLIK (SINKRON KE TENTANG KAMI STYLE) */}
            <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border p-6 shadow-card hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-500 group/rating">
              {/* Glow Effect di Background */}
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gold/10 blur-xl group-hover/rating:scale-125 transition-transform duration-500"></div>
              
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 bg-gold/10 rounded-2xl text-gold border border-gold/20 shrink-0 shadow-sm">
                  <Star className="h-5 w-5 text-gold fill-gold animate-pulse" />
                </div>
                <div>
                  <h3 className="font-brand font-black text-xs uppercase tracking-wider text-card-foreground">Suara Publik</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Rating Pelayanan</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-5 font-semibold">
                Yuk bantu kami terus berbenah! Berikan penilaian bintang dan saran pelayanan kepengurusan PC IPNU IPPNU Kota Bekasi demi kemajuan bersama.
              </p>

              <Link 
                to="/rating" 
                className="w-full py-4 bg-primary hover:bg-primary-deep text-primary-foreground text-[10px] font-brand font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/15 active:scale-95 group/btn"
              >
                Beri Nilai Sekarang 
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <div className="bg-foreground py-16"><VideoHighlight /></div>
      <CategorySection />
    </Layout>
  );
};

export default Index;
