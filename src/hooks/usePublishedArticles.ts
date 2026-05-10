import { useEffect, useState } from "react";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { articles as mockArticles, type Article } from "@/data/news";

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

const dbToArticle = (n: DbNews): Article => ({
  id: n.id,
  slug: n.slug,
  title: n.title,
  excerpt: n.excerpt,
  content: n.content.split(/\n\n+/),
  image: n.image_url || "/placeholder.svg",
  category: n.category as Article["category"],
  author: n.author_name ?? "Redaksi",
  date: new Date(n.published_at ?? n.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  }),
  readTime: Math.max(1, Math.round(n.content.split(/\s+/).length / 200)),
  views: n.views,
  tags: n.tags ?? [],
});

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
