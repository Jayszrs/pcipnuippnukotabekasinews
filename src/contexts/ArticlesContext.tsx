import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { type Article, type Category } from "@/data/news";

interface DbNews {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  views: number;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
}

export interface ArticleWithVideo extends Article {
  videoUrl?: string | null;
  publishedAt?: string;
}

const dbToArticle = (n: DbNews): ArticleWithVideo => ({
  id: n.id,
  slug: n.slug,
  title: n.title,
  excerpt: n.excerpt,
  content: n.content.split(/\n\n+/),
  image: n.image_url || "/placeholder.svg",
  category: n.category as Category,
  author: n.author_name ?? "Redaksi",
  date: new Date(n.published_at ?? n.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  }),
  readTime: Math.max(1, Math.round(n.content.split(/\s+/).length / 200)),
  views: n.views,
  tags: n.tags ?? [],
  videoUrl: n.video_url,
  publishedAt: n.published_at ?? n.created_at,
});

interface Ctx {
  articles: ArticleWithVideo[];
  loading: boolean;
  getBySlug: (slug: string) => ArticleWithVideo | undefined;
  getRelated: (a: ArticleWithVideo, limit?: number) => ArticleWithVideo[];
  getByCategory: (cat: string) => ArticleWithVideo[];
  getPopular: (limit?: number) => ArticleWithVideo[];
  getTrendingTags: () => string[];
  getVideos: () => ArticleWithVideo[];
}

const ArticlesContext = createContext<Ctx | null>(null);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  // Nilai awal adalah array kosong karena kita hanya pakai data dari database
  const [articles, setArticles] = useState<ArticleWithVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setArticles([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchArticles = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (!mounted) return;
      
      if (data) {
        setArticles(data.map((d) => dbToArticle(d as DbNews)));
      }
      setLoading(false);
    };

    fetchArticles();

    // Realtime updates: web otomatis update kalau lu tambah berita di Supabase
    const ch = supabase
      .channel("public:news")
      .on("postgres_changes", { event: "*", schema: "public", table: "news" }, fetchArticles)
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  const value: Ctx = {
    articles,
    loading,
    getBySlug: (slug) => articles.find((a) => a.slug === slug),
    getRelated: (a, limit = 3) =>
      articles.filter((x) => x.id !== a.id && x.category === a.category).slice(0, limit),
    getByCategory: (cat) =>
      articles.filter((a) => a.category.toLowerCase() === cat.toLowerCase()),
    getPopular: (limit = 5) =>
      [...articles].sort((a, b) => b.views - a.views).slice(0, limit),
    getTrendingTags: () => {
      const counts = new Map<string, number>();
      articles.forEach((a) => a.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
    },
    getVideos: () => articles.filter((a) => !!a.videoUrl),
  };

  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
};

export const useArticles = (): Ctx => {
  const ctx = useContext(ArticlesContext);
  // Default fallback kosong jika context tidak ditemukan
  return ctx ?? {
    articles: [],
    loading: false,
    getBySlug: () => undefined,
    getRelated: () => [],
    getByCategory: () => [],
    getPopular: () => [],
    getTrendingTags: () => [],
    getVideos: () => [],
  };
};
