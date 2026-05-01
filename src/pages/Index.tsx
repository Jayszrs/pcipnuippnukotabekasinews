import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { VideoHighlight } from "@/components/VideoHighlight";
import { EventBanner } from "@/components/EventBanner";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { useArticles } from "@/contexts/ArticlesContext";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { articles } = useArticles();

  useEffect(() => {
    document.title = "IPNU IPPNU Kota Bekasi — Portal Berita Pelajar NU";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Portal berita resmi PC IPNU IPPNU Kota Bekasi. Berita kegiatan, opini, dan informasi pelajar Nahdlatul Ulama Kota Bekasi.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  // Mengambil berita terbaru setelah Headline (index 1 sampai 7)
  const latest = articles.slice(1, 7);

  return (
    <Layout>
      {/* 1. Hero Section (Headline Utama) */}
      <Hero />

      {/* 2. Event/Running Text Banner */}
      <EventBanner />

      {/* 3. Main Content Section (Terkini + Sidebar) */}
      <section className="container-news py-10 lg:py-16 bg-background">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16">
          <div className="space-y-10">
            {/* Header Seksi Terkini */}
            <div className="flex items-end justify-between border-b-2 border-primary pb-4">
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-primary font-brand font-bold text-xs uppercase tracking-[0.2em] mb-2">
                  <Sparkles className="h-3 w-3" /> Terkini
                </span>
                <h2 className="font-display font-black text-3xl lg:text-4xl text-foreground uppercase italic">
                  Berita Terbaru
                </h2>
              </div>
              <Link 
                to="/kategori/kegiatan-ipnu" 
                className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all group"
              >
                LIHAT SEMUA <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid Berita Terbaru */}
            {latest.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-muted rounded-xl">
                <p className="text-muted-foreground font-medium italic">Belum ada berita yang diterbitkan.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                {latest.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Kanan */}
          <Sidebar />
        </div>
      </section>

      {/* 4. Video Highlight (Liputan Terbaru) */}
      <div className="bg-foreground py-16">
        <VideoHighlight />
      </div>

      {/* 5. Category Sections (Berita per Kategori) */}
      <CategorySection />
    </Layout>
  );
};

export default Index;