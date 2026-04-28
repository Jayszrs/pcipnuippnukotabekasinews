import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { getArticleBySlug, getRelatedArticles } from "@/data/news";
import { Clock, Eye, Share2, Facebook, Twitter, MessageCircle, Link2, ChevronRight, Home } from "lucide-react";

const Article = () => {
  const { slug } = useParams();
  const article = slug ? getArticleBySlug(slug) : undefined;

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — IPNU IPPNU Bekasi`;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [article]);

  if (!article) return <Navigate to="/" replace />;

  const related = getRelatedArticles(article);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(url);

  return (
    <Layout>
      <article className="container-news py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="h-3 w-3" />Beranda</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="hover:text-primary">{article.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          <div className="min-w-0">
            <CategoryBadge category={article.category} size="md" />
            <h1 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-balance">
              {article.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 pb-5 border-b border-border text-sm">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground">{article.author}</div>
                  <div className="text-xs text-muted-foreground">{article.date}</div>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />{article.readTime} menit baca</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><Eye className="h-4 w-4" />{article.views.toLocaleString("id-ID")} views</span>
            </div>

            <div className="mt-6 aspect-[16/10] overflow-hidden rounded-sm bg-muted">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground italic">Foto: Dokumentasi PC IPNU IPPNU Kota Bekasi</p>

            {/* Body */}
            <div className="mt-8 prose-news space-y-5 text-[17px] leading-[1.85] text-foreground/90">
              {article.content.map((p, i) => (
                <p key={i} className="text-pretty">
                  {i === 0 ? <span className="font-bold text-foreground">{p}</span> : p}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-brand font-bold uppercase tracking-wider text-muted-foreground mr-1">Tags:</span>
              {article.tags.map((t) => (
                <a key={t} href="#" className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">#{t}</a>
              ))}
            </div>

            {/* Share */}
            <div className="mt-6 p-5 bg-secondary rounded-sm flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Share2 className="h-4 w-4 text-primary" />
                Bagikan artikel ini:
              </div>
              <div className="flex gap-2">
                <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-sm bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Share WhatsApp"><MessageCircle className="h-4 w-4" /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-sm bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Share Facebook"><Facebook className="h-4 w-4" /></a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-sm bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Share Twitter"><Twitter className="h-4 w-4" /></a>
                <button onClick={() => navigator.clipboard?.writeText(url)} className="h-10 w-10 rounded-sm bg-muted hover:bg-foreground hover:text-background flex items-center justify-center transition-colors" aria-label="Copy link"><Link2 className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display font-black text-2xl lg:text-3xl border-b-2 border-foreground pb-3 mb-6">
                  Berita Terkait
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((a) => <NewsCard key={a.id} article={a} />)}
                </div>
              </section>
            )}
          </div>

          <Sidebar />
        </div>
      </article>
    </Layout>
  );
};

export default Article;
