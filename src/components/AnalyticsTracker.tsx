import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { useArticles } from "@/contexts/ArticlesContext";

const VISITOR_KEY = "ipnu-ippnu-visitor-id";
const DEDUPE_KEY = "ipnu-ippnu-last-page-view";
const DEDUPE_MS = 30_000;

const getVisitorId = () => {
  if (typeof window === "undefined") return "server";

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(VISITOR_KEY, next);
  return next;
};

const recentlyTracked = (key: string) => {
  if (typeof window === "undefined") return true;

  const raw = window.sessionStorage.getItem(DEDUPE_KEY);
  let last: { key?: string; at?: number } | null = null;
  try {
    last = raw ? (JSON.parse(raw) as { key?: string; at?: number }) : null;
  } catch {
    last = null;
  }
  const now = Date.now();

  if (last?.key === key && last.at && now - last.at < DEDUPE_MS) return true;

  window.sessionStorage.setItem(DEDUPE_KEY, JSON.stringify({ key, at: now }));
  return false;
};

export const AnalyticsTracker = () => {
  const location = useLocation();
  const { articles, loading } = useArticles();

  const routeInfo = useMemo(() => {
    const path = location.pathname;
    const articleMatch = path.match(/^\/berita\/([^/]+)/);
    const articleSlug = articleMatch?.[1] ? decodeURIComponent(articleMatch[1]) : null;
    const article = articleSlug ? articles.find((item) => item.slug === articleSlug) : undefined;

    return {
      path,
      article,
      articleSlug,
      pageType: articleSlug ? "article" : "page",
    };
  }, [articles, location.pathname]);

  useEffect(() => {
    if (routeInfo.path.startsWith("/admin")) return;
    if (routeInfo.articleSlug && loading) return;

    const trackKey = `${routeInfo.path}${location.search}`;
    if (recentlyTracked(trackKey)) return;

    const payload = {
      visitor_id: getVisitorId(),
      path: routeInfo.path,
      search: location.search || "",
      page_type: routeInfo.pageType,
      article_id: routeInfo.article?.id ?? null,
      article_slug: routeInfo.articleSlug,
      article_title: routeInfo.article?.title ?? null,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    };

    supabase
      .from("site_analytics")
      .insert(payload)
      .then(({ error }) => {
        if (error) console.warn("Gagal merekam analytics:", error.message);
      });
  }, [loading, location.search, routeInfo]);

  return null;
};

export default AnalyticsTracker;
