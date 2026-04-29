import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/news";
import { useArticles } from "@/contexts/ArticlesContext";
import { NewsCard } from "./NewsCard";

export const CategorySection = () => {
  const { articles } = useArticles();
  return (
    <section className="container-news py-12 lg:py-16">
      <div className="flex items-end justify-between mb-8 border-b-2 border-foreground pb-3">
        <div>
          <span className="section-label">Jelajahi</span>
          <h2 className="mt-2 font-display font-black text-3xl lg:text-4xl">
            Berita per Kategori
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
        {categories.slice(0, 4).map((cat) => {
          const items = articles.filter((a) => a.category === cat).slice(0, 2);
          if (items.length === 0) return null;
          const slug = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"));
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h3 className="font-brand font-extrabold text-lg uppercase tracking-wide flex items-center gap-2">
                  <span className="block h-5 w-1 bg-gold" />
                  {cat}
                </h3>
                <Link
                  to={`/kategori/${slug}`}
                  className="text-xs font-bold text-primary hover:gap-2 inline-flex items-center gap-1 transition-all"
                >
                  Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-5">
                {items.map((a, i) => (
                  <NewsCard key={a.id} article={a} variant={i === 0 ? "default" : "horizontal"} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
