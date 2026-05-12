import { useEffect, useState } from "react";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { articles as mockArticles, type Article } from "@/data/news";

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

const normalizeCategory = (category: string): Article["category"] => {
  if (category === "Kegiatan IPNU" || category === "Kegiatan IPPNU" || category === "Kegiatan IPNU & IPPNU") {
    return "Kegiatan IPNU & IPPNU";
  }

  if (category === "Bekasi Update" || category === "Nasional" || category === "Opini") return category;
  return "Bekasi Update";
};

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

const dbToArticle = (n: DbNews): Article => {
  const content = normalizeContent(n.content);
  const publishedAt = normalizePublishedAt(n.published_at, n.created_at);

  return {
    id: n.id,
    slug: n.slug || n.id,
    title: n.title || "Berita tanpa judul",
    excerpt: n.excerpt || "",
    content,
    image: normalizeImage(n.image_url),
    category: normalizeCategory(n.category),
    author: n.author_name ?? "Redaksi",
    date: new Date(publishedAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    }),
    readTime: Math.max(1, Math.round(content.join(" ").split(/\s+/).filter(Boolean).length / 200)),
    views: n.views ?? 0,
    tags: normalizeTags(n.tags),
  };
};

export const usePublishedArticles = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (data && data.length > 0) {
        setArticles(data.map((d) => dbToArticle(d as DbNews)));
      }
      setLoading(false);
    })();
  }, []);

  return { articles, loading };
};
