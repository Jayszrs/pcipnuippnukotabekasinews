import { Link } from "react-router-dom";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { useArticles } from "@/contexts/ArticlesContext";
import { CategoryBadge } from "./CategoryBadge";

export const Hero = () => {
  const { articles } = useArticles();
  if (articles.length === 0) return null;
  const main = articles[0];
  const secondary = articles.slice(1, 4);

  return (
    <section className="container-news pt-6 lg:pt-10">
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
        {/* Main */}
        <Link
          to={`/berita/${main.slug}`}
          className="relative block aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-sm group shadow-elevated"
        >
          <img
            src={main.image}
            alt={main.title}
            width={1536}
            height={1024}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 bg-breaking text-breaking-foreground px-2.5 py-1 text-[10px] font-brand font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              Headline
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
            <CategoryBadge category={main.category} size="md" />
            <h1 className="mt-3 font-display font-black text-2xl sm:text-3xl lg:text-5xl leading-[1.05] text-balance">
              {main.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/85 line-clamp-2 max-w-2xl">
              {main.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80">
              <span className="font-semibold text-gold">{main.author}</span>
              <span>{main.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{main.readTime} menit baca</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{main.views.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </Link>

        {/* Side stack */}
        <div className="flex flex-col divide-y divide-border">
          <div className="pb-4">
            <h2 className="section-label">Berita Pilihan</h2>
          </div>
          {secondary.map((a) => (
            <article key={a.id} className="py-4 first:pt-4 last:pb-0">
              <Link to={`/berita/${a.slug}`} className="grid grid-cols-[1fr_110px] gap-3 group">
                <div>
                  <CategoryBadge category={a.category} />
                  <h3 className="mt-2 font-display font-bold text-base lg:text-lg leading-tight line-clamp-3 group-hover:text-primary transition-colors text-balance">
                    {a.title}
                  </h3>
                  <div className="mt-2 text-xs text-muted-foreground">{a.date}</div>
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
