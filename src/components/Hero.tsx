import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useArticles } from "@/contexts/ArticlesContext";
import { CategoryBadge } from "./CategoryBadge";

export const Hero = () => {
  const { articles } = useArticles();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Definisikan data yang dibutuhkan
  const sliderArticles = articles.slice(0, 3);
  const secondaryArticles = articles.length > 3 
    ? articles.slice(3, 6) 
    : [...articles].reverse();

  // 2. Panggil semua Hook (useEffect) di bagian atas
  useEffect(() => {
    // Jalankan interval hanya jika ada artikel untuk slider
    if (sliderArticles.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sliderArticles.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(timer);
  }, [sliderArticles.length]);

  // 3. Early return dilakukan SETELAH semua Hook dipanggil
  if (articles.length === 0) return null;

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === sliderArticles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? sliderArticles.length - 1 : prev - 1));
  };

  return (
    <section className="container-news pt-6 lg:pt-10">
      
      {/* News Ticker / Running Text */}
      <div className="flex items-center bg-gray-100 rounded-sm overflow-hidden mb-6 border border-gray-200">
        <div className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold flex items-center gap-1 shrink-0 z-10 shadow-md">
          <Zap className="h-4 w-4 text-gold fill-gold" />
          TERKINI
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap text-sm text-gray-700 flex gap-10">
            {articles.slice(0, 5).map((a) => (
              <span key={`ticker-${a.id}`}>
                <span className="font-bold text-primary mr-2">•</span> 
                <Link to={`/berita/${a.slug}`} className="hover:text-primary transition-colors">
                  {a.title}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
        
        {/* Main Headline Slider */}
        <div className="relative aspect-square sm:aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-sm group shadow-elevated">
          
          <div 
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sliderArticles.map((main) => (
              <Link
                key={main.id}
                to={`/berita/${main.slug}`}
                className="w-full h-full shrink-0 relative block"
              >
                <img
                  src={main.image}
                  alt={main.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 gradient-hero bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-breaking text-breaking-foreground px-2.5 py-1 text-[10px] font-brand font-bold uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                    Headline
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white z-10">
                  {/* Membungkus dengan div dan stopPropagation untuk menghindari nested link error */}
                  <div 
                    className="inline-block relative z-20 pointer-events-none mb-2"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CategoryBadge category={main.category} size="md" />
                  </div>
                  
                  <h1 className="mt-2 font-display font-bold text-lg sm:text-3xl lg:text-5xl leading-tight sm:leading-[1.1] text-balance line-clamp-3">
                    {main.title}
                  </h1>
                  
                  <p className="mt-2 hidden sm:block text-sm sm:text-base text-white/85 line-clamp-2 max-w-2xl">
                    {main.excerpt}
                  </p>
                  
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/80">
                    <span className="font-semibold text-gold">{main.author}</span>
                    <span>{main.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{main.readTime} menit baca</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(main.views || 0).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 right-6 z-20 flex gap-2">
            {sliderArticles.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${currentIndex === idx ? "w-6 bg-gold" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Side stack (Berita Pilihan) */}
        <div className="flex flex-col divide-y divide-border">
          <div className="pb-4">
            <h2 className="section-label">Berita Pilihan</h2>
          </div>
          {secondaryArticles.map((a) => (
            <article key={a.id} className="py-4 first:pt-4 last:pb-0">
              <Link to={`/berita/${a.slug}`} className="grid grid-cols-[1fr_110px] gap-3 group">
                <div>
                  <div className="inline-block pointer-events-none mb-1" onClick={(e) => e.preventDefault()}>
                    <CategoryBadge category={a.category} />
                  </div>
                  <h3 className="mt-2 font-display font-bold text-sm sm:text-base lg:text-lg leading-tight line-clamp-3 group-hover:text-primary transition-colors text-balance">
                    {a.title}
                  </h3>
                  <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground">{a.date}</div>
                </div>
                <div className="aspect-square overflow-hidden rounded-sm bg-muted">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </Link>
            </article>
          ))}
          
          <Link
            to="/kategori/kegiatan-ipnu"
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
          >
            Lihat semua headline <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};