import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { articles } from "@/data/news";
import { Play, Image as ImageIcon } from "lucide-react";

const Media = () => {
  const [tab, setTab] = useState<"foto" | "video">("foto");

  useEffect(() => {
    document.title = "Media & Galeri — IPNU IPPNU Bekasi";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <Layout>
      <div className="bg-secondary border-b border-border">
        <div className="container-news py-10 lg:py-14">
          <span className="section-label">Dokumentasi</span>
          <h1 className="mt-2 font-display font-black text-4xl lg:text-5xl">
            Galeri Foto & Video
          </h1>
          <p className="mt-2 text-muted-foreground">
            Dokumentasi visual kegiatan IPNU IPPNU Kota Bekasi
          </p>
        </div>
      </div>

      <section className="container-news py-10">
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setTab("foto")}
            className={`px-5 py-3 font-brand font-bold text-sm uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${tab === "foto" ? "border-gold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <ImageIcon className="h-4 w-4" /> Foto
          </button>
          <button
            onClick={() => setTab("video")}
            className={`px-5 py-3 font-brand font-bold text-sm uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${tab === "video" ? "border-gold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Play className="h-4 w-4" /> Video
          </button>
        </div>

        {tab === "foto" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {articles.map((a, i) => (
              <div key={a.id} className={`relative overflow-hidden rounded-sm group cursor-pointer ${i % 5 === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"}`}>
                <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 gradient-card-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-bold line-clamp-2">{a.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.slice(0, 6).map((a) => (
              <div key={a.id} className="group cursor-pointer">
                <div className="relative aspect-video overflow-hidden rounded-sm bg-muted">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-gold flex items-center justify-center shadow-gold">
                      <Play className="h-6 w-6 text-gold-foreground fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">08:42</div>
                </div>
                <h3 className="mt-3 font-brand font-bold text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.date}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Media;
