import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useArticles } from "@/contexts/ArticlesContext";
import {
  upsertMeta,
  setCanonical,
  setJsonLd,
  removeJsonLd,
  truncate,
  applyDefaultMeta,
} from "@/lib/seo";
import { 
  Clock, 
  Eye, 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Link2, 
  ChevronRight, 
  Home, 
  ExternalLink,
  Instagram,
  Image as ImageIcon
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

// Helper untuk deteksi file video langsung
const isDirectVideoFile = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

// Helper untuk deteksi dan format YouTube
const getYoutubeEmbed = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

// --- PERBAIKAN HELPER INSTAGRAM (Mendukung Post & Reels) ---
const getInstagramEmbed = (url: string): string | null => {
  // Regex untuk menangkap ID dari link /p/, /reel/, atau /reels/
  const match = url.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#&]+)/);
  if (match) {
    return `https://www.instagram.com/p/${match[1]}/embed`;
  }
  return null;
};

const Article = () => {
  const { slug } = useParams();
  const { getBySlug, getRelated, loading } = useArticles();
  const article = slug ? getBySlug(slug) : undefined;

  useEffect(() => {
    if (!article) return;
    const pageUrl = `${SITE_CONFIG.siteUrl}/berita/${article.slug}`;
    const title = `${article.title} — PC IPNU IPPNU Kota Bekasi`;
    const desc = truncate(article.excerpt || article.content?.join(" ") || "", 155);
    const image = article.image || "/placeholder.svg";

    document.title = title;
    upsertMeta("name", "description", desc);
    upsertMeta("name", "keywords", `IPNU IPPNU Bekasi, Pelajar NU Bekasi, ${article.category}, ${(article.tags || []).join(", ")}`);
    setCanonical(pageUrl);

    upsertMeta("property", "og:type", "article");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:url", pageUrl);
    upsertMeta("property", "og:site_name", "IPNU IPPNU Kota Bekasi");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", image);

    const publishedIso = article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : new Date().toISOString();

    setJsonLd("article-jsonld", {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      image: [image],
      datePublished: publishedIso,
      dateModified: publishedIso,
      author: {
        "@type": "Person",
        name: article.author || "LPP IPNU IPPNU Kota Bekasi",
      },
      publisher: {
        "@type": "Organization",
        name: "PC IPNU IPPNU Kota Bekasi",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.siteUrl}/icon-web.ico`,
        },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      description: desc,
      articleSection: article.category,
    });

    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      removeJsonLd("article-jsonld");
      applyDefaultMeta();
    };
  }, [article]);

  if (loading && !article) {
    return <Layout><div className="container-news py-20 text-center text-muted-foreground">Memuat berita...</div></Layout>;
  }
  if (!article) return <Navigate to="/" replace />;

  const related = getRelated(article);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(url);

  const videoUrl = article.videoUrl;
  const ytEmbed = videoUrl ? getYoutubeEmbed(videoUrl) : null;
  const igEmbed = videoUrl ? getInstagramEmbed(videoUrl) : null;

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

            {/* --- GAMBAR UTAMA / POSTER (BERSIH & ANTI-CROP) --- */}
            {article.image && (
              <div className="mt-6">
                <a 
                  href={article.image} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="cursor-zoom-in block"
                  title="Klik untuk memperbesar"
                >
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.01]" 
                  />
                </a>
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground italic text-center">
              Foto: Dokumentasi PC IPNU IPPNU Kota Bekasi (Klik gambar untuk memperbesar)
            </p>

            {/* --- VIDEO & INSTAGRAM (FIX REELS & LINK HREF) --- */}
            {videoUrl && (
              <div className="mt-8 space-y-4">
                <div className={`relative w-full overflow-hidden rounded-xl bg-transparent ${igEmbed ? 'aspect-[4/5] sm:aspect-[1/1.2]' : 'aspect-video bg-black shadow-lg'}`}>
                  {isDirectVideoFile(videoUrl) ? (
                    <video src={videoUrl} controls className="w-full h-full" />
                  ) : ytEmbed ? (
                    <iframe 
                      src={ytEmbed} 
                      title={article.title} 
                      className="w-full h-full" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                    />
                  ) : igEmbed ? (
                    <iframe 
                      src={igEmbed} 
                      title="Instagram Content" 
                      className="absolute inset-0 w-full h-full border-none" 
                      frameBorder="0" 
                      scrolling="no" 
                      allowTransparency={true}
                    />
                  ) : (
                    <a href={videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white hover:bg-black/70 transition-colors">
                      <ExternalLink className="h-10 w-10 mb-3" />
                      <span className="text-sm font-bold">Tonton di sumber asli</span>
                      <span className="text-xs text-white/70 mt-1 px-4 break-all max-w-md text-center">{videoUrl}</span>
                    </a>
                  )}
                </div>
                
                {/* Link Href ke Postingan Asli */}
                <div className="flex justify-center">
                  <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-4 py-2 rounded-full border border-border"
                  >
                    <Instagram className="h-3.5 w-3.5" /> Lihat Postingan Asli di Instagram
                  </a>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="mt-8 prose-news space-y-5 text-[17px] leading-[1.85] text-foreground/90">
              {article.content.map((p, i) => (
                <p key={i} className="text-pretty">
                  {i === 0 ? <span className="font-bold text-foreground">{p}</span> : p}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-xs font-brand font-bold uppercase tracking-wider text-muted-foreground mr-1">Tags:</span>
                {article.tags.map((t) => (
                  <a key={t} href="#" className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">#{t}</a>
                ))}
              </div>
            )}

            {/* Share Section */}
            <div className="mt-6 p-5 bg-secondary rounded-sm flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Share2 className="h-4 w-4 text-primary" />
                Bagikan artikel ini:
              </div>
              <div className="flex gap-2">
                <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-sm bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"><MessageCircle className="h-4 w-4" /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-sm bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"><Facebook className="h-4 w-4" /></a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-sm bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"><Twitter className="h-4 w-4" /></a>
                <button onClick={() => navigator.clipboard?.writeText(url)} className="h-10 w-10 rounded-sm bg-muted hover:bg-foreground hover:text-background flex items-center justify-center transition-colors"><Link2 className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Related Articles */}
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
