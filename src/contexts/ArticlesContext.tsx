import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { isFirebaseConfigured } from "@/integrations/firebase/client";
import { subscribeCollection } from "@/integrations/firebase/data";
import { type Article, type Category } from "@/data/news";

interface DbNews {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | string[] | null;
  category: string;
  image_url: string | string[] | null;
  video_url: string | null;
  tags: string[] | string | null;
  views: number | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
}

export interface ArticleWithVideo extends Article {
  videoUrl?: string | null;
  publishedAt?: string;
}

const isCategory = (category: string): category is Category =>
  ["Kegiatan IPNU", "Kegiatan IPPNU", "Bekasi Update", "Nasional", "Opini"].includes(category);

const normalizeContent = (content: DbNews["content"]) => {
  if (Array.isArray(content)) return content.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  if (typeof content === "string") return content.split(/\n\n+/).map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeTags = (tags: DbNews["tags"]) => {
  if (Array.isArray(tags)) return tags.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  if (typeof tags === "string") return tags.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeImage = (imageUrl: DbNews["image_url"]) => {
  if (Array.isArray(imageUrl)) return imageUrl.find((item) => typeof item === "string" && item.trim() !== "") ?? "/placeholder.svg";
  return imageUrl || "/placeholder.svg";
};

const normalizePublishedAt = (publishedAt: string | null, createdAt: string) => {
  const fallback = new Date().toISOString();
  const value = publishedAt || createdAt || fallback;
  return Number.isNaN(new Date(value).getTime()) ? fallback : value;
};

const dbToArticle = (n: DbNews): ArticleWithVideo => {
  const content = normalizeContent(n.content);
  const publishedAt = normalizePublishedAt(n.published_at, n.created_at);

  return {
    id: n.id,
    slug: n.slug || n.id,
    title: n.title || "Berita tanpa judul",
    excerpt: n.excerpt || "",
    content,
    image: normalizeImage(n.image_url),
    category: isCategory(n.category) ? n.category : "Bekasi Update",
    author: n.author_name ?? "Redaksi",
    date: new Date(publishedAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    }),
    readTime: Math.max(1, Math.round(content.join(" ").split(/\s+/).filter(Boolean).length / 200)),
    views: n.views ?? 0,
    tags: normalizeTags(n.tags),
    videoUrl: n.video_url,
    publishedAt,
  };
};

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
    if (!isFirebaseConfigured) {
      setArticles([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const unsubscribe = subscribeCollection<DbNews>(
      "news",
      {
        filters: [{ field: "status", op: "==", value: "published" }],
        order: [{ field: "published_at", direction: "desc" }],
      },
      (data) => {
        if (!mounted) return;
        setArticles(data.map((d) => dbToArticle(d)));
        setLoading(false);
      },
      (error) => {
        console.error("Gagal memuat berita Firebase:", error);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
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
