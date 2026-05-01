import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useArticles } from "@/contexts/ArticlesContext";
import { CategoryBadge } from "./CategoryBadge";

export const Hero = () => {
  const { articles } = useArticles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderArticles = articles.slice(0, 3);
  const secondaryArticles = articles.length > 3 ? articles.slice(3, 6) : articles.slice(0, 3);

  const nextSlide = useCallback(() => {
    if (sliderArticles.length === 0) return;
    setCurrentIndex((prev) => (prev === sliderArticles.length - 1 ? 0 : prev + 1));
  }, [sliderArticles.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderArticles.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (sliderArticles.length === 0) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, sliderArticles.length]);

  if (articles.length === 0) return null;

  return (
    <section className="container-news pt-4 lg:pt-8 bg-background">
      
      {/* --- NEWS TICKER (TIPIS & MINIMALIS) --- */}
      <div className="flex items-center bg-muted/40 rounded-lg overflow-hidden mb-6 border border-border/60">
        <div className="bg-primary text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 z-10">
          <Zap className="h-3 w-3 fill-gold text-gold" />
          TERKINI
        </div>
        <div className="flex-1 overflow-hidden py-1">
          <div className="animate-marquee whitespace-nowrap text-[12px] text-muted-foreground flex gap-10 font-medium">
            {articles.slice(0, 5).map((a) => (
              <Link key={`ticker-${a.id}`} to={`/berita/${a.slug}`} className="hover:text-primary transition-colors">
                <span className="font-bold text-primary/40 mr-2">•</span> {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        
        {/* --- MAIN SLIDER (TIPOGRAFI PROPORSIONAL) --- */}
        <div className="relative aspect-square sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-xl group border border-border shadow-sm">
          
          <div 
            className="flex w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sliderArticles.map((main) => (
              <Link key={main.id} to={`/berita/${main.slug}`} className="w-full h-full shrink-0 relative block">
                <img
                  src={main.image}
                  alt={main.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* GRADIENT HALUS: Gelap hanya di bagian bawah supaya logo di gambar tetap kelihatan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="bg-primary/90 backdrop-blur-sm text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                    HEADLINE
                  </span>
                  <CategoryBadge category={main.category} size="sm" className="bg-white/10 backdrop-blur-md border-white/20 text-white" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-20">
                  {/* UKURAN TEKS DIPERBAIKI: Responsif dan tidak menutupi gambar utama */}
                  <h1 className="font-display font-bold text-lg sm:text-2xl lg:text-3xl leading-snug mb-2 drop-shadow-md">
                    {main.title}
                  </h1>
                  
                  <p className="hidden sm:block text-[13px] text-white/80 line-clamp-2 max-w-2xl mb-4 font-medium">
                    {main.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.1em] opacity-80">
                    <span className="text-gold font-black">{main.author}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {main.readTime} Min</span>
                    <span className="flex items-center gap-1.5"><Eye className="h-3 w-3" /> {main.views || 0} Views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigasi (Soft Blur) */}
          <button onClick={(e) => { e.preventDefault(); prevSlide(); }} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-black/10 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30 backdrop-blur-sm border border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={(e) => { e.preventDefault(); nextSlide(); }} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-black/10 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30 backdrop-blur-sm border border-white/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* --- SIDE STACK (LEBIH COMPACT) --- */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Berita Pilihan</h2>
          </div>
          <div className="flex flex-col divide-y divide-border/60">
            {secondaryArticles.map((a) => (
              <article key={a.id} className="py-3.5 first:pt-0 group">
                <Link to={`/berita/${a.slug}`} className="grid grid-cols-[1fr_100px] gap-4">
                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[9px] font-bold text-primary/80 uppercase tracking-tighter mb-1 block">{a.category}</span>
                      <h3 className="font-bold text-sm leading-[1.3] line-clamp-2 group-hover:text-primary transition-colors text-balance">
                        {a.title}
                      </h3>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground">{a.date}</p>
                  </div>
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted border border-border/40">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};