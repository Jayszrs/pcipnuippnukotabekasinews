import { Link } from "react-router-dom";
import { Flame, Hash, TrendingUp, Bell } from "lucide-react";
import { categories, categoryToSlug } from "@/data/news";
import { useArticles } from "@/contexts/ArticlesContext";

export const Sidebar = () => {
  const { getPopular, getTrendingTags } = useArticles();
  const popular = getPopular(5);
  const tags = getTrendingTags();

  return (
    <aside className="space-y-8">
      {/* Newsletter */}
      <div className="relative overflow-hidden rounded-sm gradient-primary text-primary-foreground p-6 shadow-elevated">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
        <Bell className="h-7 w-7 text-gold" />
        <h3 className="mt-3 font-display font-bold text-xl">Notifikasi Berita</h3>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Dapatkan berita terbaru IPNU IPPNU Kota Bekasi langsung ke email Anda.
        </p>
        <form className="mt-4 flex flex-col gap-2">
          <input
            type="email"
            placeholder="email@kamu.com"
            className="px-3 py-2.5 rounded-sm text-sm bg-white/95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            type="submit"
            className="px-3 py-2.5 rounded-sm bg-gold text-gold-foreground font-brand font-bold text-sm uppercase tracking-wider hover:bg-gold-soft transition-colors shadow-gold"
          >
            Berlangganan
          </button>
        </form>
      </div>

      {/* Popular */}
      <div>
        <div className="flex items-center gap-2 pb-3 border-b-2 border-foreground">
          <Flame className="h-5 w-5 text-breaking" />
          <h3 className="font-brand font-extrabold text-base uppercase tracking-wide">
            Berita Populer
          </h3>
        </div>
        <ol className="mt-4 space-y-4">
          {popular.map((a, i) => (
            <li key={a.id}>
              <Link to={`/berita/${a.slug}`} className="flex gap-3 group">
                <span className="font-display font-black text-3xl leading-none text-gold/70 group-hover:text-gold transition-colors w-7 shrink-0">
                  {i + 1}
                </span>
                <h4 className="font-brand font-bold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                  {a.title}
                </h4>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 pb-3 border-b-2 border-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-brand font-extrabold text-base uppercase tracking-wide">Kategori</h3>
        </div>
        <ul className="mt-4 space-y-1">
          {categories.map((c) => (
            <li key={c}>
              <Link
                to={`/kategori/${categoryToSlug(c)}`}
                className="flex items-center justify-between py-2.5 px-3 rounded-sm hover:bg-muted transition-colors text-sm font-semibold"
              >
                <span>{c}</span>
                <span className="text-xs text-muted-foreground">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 pb-3 border-b-2 border-foreground">
            <Hash className="h-5 w-5 text-primary" />
            <h3 className="font-brand font-extrabold text-base uppercase tracking-wide">Tag Trending</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <a
                key={t}
                href="#"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{t}
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
