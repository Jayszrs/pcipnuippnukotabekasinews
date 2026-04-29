import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { VideoHighlight } from "@/components/VideoHighlight";
import { EventBanner } from "@/components/EventBanner";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { useArticles } from "@/contexts/ArticlesContext";
import { ArrowRight } from "lucide-react";
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

  const latest = articles.slice(1, 7);

  return (
    <Layout>
      <Hero />

      <EventBanner />

      {/* Latest + Sidebar */}
      <section className="container-news py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12">
          <div>
            <div className="flex items-end justify-between mb-6 border-b-2 border-foreground pb-3">
              <div>
                <span className="section-label">Terkini</span>
                <h2 className="mt-2 font-display font-black text-3xl lg:text-4xl">Berita Terbaru</h2>
              </div>
              <Link to="/kategori/kegiatan-ipnu" className="text-sm font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
                Semua <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {latest.length === 0 ? (
              <p className="text-muted-foreground">Belum ada berita.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                {latest.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </section>

      <VideoHighlight />
      <CategorySection />
    </Layout>
  );
};

export default Index;
