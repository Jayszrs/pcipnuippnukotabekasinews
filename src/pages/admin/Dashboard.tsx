import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { useAuth } from "@/contexts/AuthContext";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  FileCheck2,
  Loader2,
  Image as ImageIcon,
  Video,
  Camera,
  Save,
  X,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface NewsRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published";
  views: number;
  image_url: string | null;
  video_url: string | null;
  published_at: string | null;
  created_at: string;
  author_name: string | null;
}

interface AnalyticsRow {
  id?: string;
  visitor_id?: string | null;
  path?: string | null;
  search?: string | null;
  page_type?: string | null;
  article_id?: string | null;
  article_slug?: string | null;
  article_title?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  created_at?: string | null;
}

const chartConfig = {
  pageViews: { label: "Page Views", color: "hsl(var(--primary))" },
  visitors: { label: "Pengunjung", color: "hsl(var(--gold))" },
  articleViews: { label: "Views Berita", color: "hsl(var(--primary-glow))" },
  views: { label: "Views", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const compactNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);

const fullNumber = (value: number) => (value || 0).toLocaleString("id-ID");

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatShortDate = (date: Date) => date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const daysAgo = (count: number) => {
  const date = startOfToday();
  date.setDate(date.getDate() - count);
  return date;
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [news, setNews] = useState<NewsRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileLoading, setProfileLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const fetchNews = async (showError = true) => {
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from("news")
        .select("id,title,slug,category,status,views,image_url,video_url,published_at,created_at,author_name")
        .order("created_at", { ascending: false });

      if (!error) {
        setNews((data ?? []) as NewsRow[]);
        return;
      }

      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300 + attempt * 500));
    }

    if (showError && lastError) {
      toast.error("Gagal memuat berita", { description: lastError.message });
    }
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from("site_analytics")
      .select("id,visitor_id,path,search,page_type,article_id,article_slug,article_title,referrer,user_agent,created_at")
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error) {
      console.warn("Gagal memuat analytics:", error.message);
      setAnalytics([]);
      return;
    }

    setAnalytics((data ?? []) as AnalyticsRow[]);
  };

  const load = async (showError = true) => {
    setLoading(true);
    await Promise.all([fetchNews(showError), fetchAnalytics()]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setFullname(String(data.full_name || ""));
      setAvatarUrl(String(data.avatar_url || ""));
    }
  };

  useEffect(() => {
    document.title = "Dashboard - IPNU IPPNU Bekasi";
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
    fetchProfile();
  }, [authLoading, user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setProfileLoading(true);

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: fullname,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

    if (error) {
      toast.error("Gagal update profil", { description: error.message });
    } else {
      toast.success("Profil diperbarui!");
      setIsEditingProfile(false);
      fetchProfile();
    }
    setProfileLoading(false);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setProfileLoading(true);
    const fileExt = file.name.split(".").pop();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const filePath = `${user.id}-${uniqueId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

    if (uploadError) {
      toast.error("Gagal upload foto", { description: uploadError.message });
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

      if (profileError) {
        toast.error("Gagal sinkron database foto");
      } else {
        setAvatarUrl(publicUrl);
        toast.success("Foto profil diperbarui!");
      }
    }
    setProfileLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus berita "${title}"?`)) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus", { description: error.message });
      return;
    }
    toast.success("Berita dihapus");
    load();
  };

  const analyticsSummary = useMemo(() => {
    const thirtyDaysAgo = daysAgo(29);
    const fourteenDaysAgo = daysAgo(13);
    const normalized = analytics
      .map((event) => ({ ...event, date: parseDate(event.created_at) }))
      .filter((event): event is AnalyticsRow & { date: Date } => !!event.date);

    const last30 = normalized.filter((event) => event.date >= thirtyDaysAgo);
    const articleEvents = normalized.filter((event) => event.page_type === "article");
    const articleEvents30 = last30.filter((event) => event.page_type === "article");
    const articleViewsBySlug = new Map<string, number>();

    articleEvents.forEach((event) => {
      const slug = event.article_slug || event.path?.split("/").filter(Boolean).pop();
      if (!slug) return;
      articleViewsBySlug.set(slug, (articleViewsBySlug.get(slug) || 0) + 1);
    });

    const displayNews = news.map((item) => {
      const trackedViews = articleViewsBySlug.get(item.slug) || 0;
      return {
        ...item,
        trackedViews,
        displayViews: (item.views || 0) + trackedViews,
      };
    });

    const trendData = Array.from({ length: 14 }, (_, index) => {
      const date = new Date(fourteenDaysAgo);
      date.setDate(fourteenDaysAgo.getDate() + index);
      const key = dateKey(date);
      const events = normalized.filter((event) => dateKey(event.date) === key);
      const visitors = new Set(events.map((event) => event.visitor_id).filter(Boolean));

      return {
        key,
        label: formatShortDate(date),
        pageViews: events.length,
        visitors: visitors.size,
        articleViews: events.filter((event) => event.page_type === "article").length,
      };
    });

    const categoryViews = Object.values(
      displayNews.reduce<Record<string, { category: string; views: number }>>((acc, item) => {
        const category = item.category || "Tanpa Kategori";
        acc[category] = acc[category] || { category, views: 0 };
        acc[category].views += item.displayViews;
        return acc;
      }, {}),
    ).sort((a, b) => b.views - a.views);

    const referrerRows = Object.values(
      last30.reduce<Record<string, { source: string; views: number }>>((acc, event) => {
        let source = "Langsung";
        if (event.referrer) {
          try {
            source = new URL(event.referrer).hostname.replace(/^www\./, "");
          } catch {
            source = "Referral";
          }
        }
        acc[source] = acc[source] || { source, views: 0 };
        acc[source].views += 1;
        return acc;
      }, {}),
    )
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const topNews = [...displayNews].sort((a, b) => b.displayViews - a.displayViews).slice(0, 6);
    const recentViews = normalized.slice(0, 8);
    const uniqueVisitors30 = new Set(last30.map((event) => event.visitor_id).filter(Boolean)).size;
    const rawNewsViews = news.reduce((sum, item) => sum + (item.views || 0), 0);

    return {
      displayNews,
      topNews,
      categoryViews,
      referrerRows,
      recentViews,
      trendData,
      uniqueVisitors30,
      pageViews30: last30.length,
      articleViews30: articleEvents30.length,
      totalTrackedArticleViews: articleEvents.length,
      totalNewsViews: rawNewsViews + articleEvents.length,
      hasAnalytics: analytics.length > 0,
    };
  }, [analytics, news]);

  const stats = {
    total: news.length,
    published: news.filter((n) => n.status === "published").length,
    draft: news.filter((n) => n.status === "draft").length,
    views: analyticsSummary.totalNewsViews,
  };

  const avgViews = stats.total ? Math.round(stats.views / stats.total) : 0;
  const mostViewed = analyticsSummary.topNews[0];

  return (
    <AdminLayout
      title="Dashboard"
      action={
        <Link
          to="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-brand font-bold text-sm hover:opacity-95 shadow-elevated"
        >
          <PlusCircle className="h-4 w-4" /> Tulis Berita
        </Link>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-inner">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {fullname?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-gold p-1.5 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform">
                <Camera className="h-4 w-4 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadAvatar} disabled={profileLoading} />
              </label>
            </div>

            <div className="space-y-1 min-w-0">
              {isEditingProfile ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="h-8 w-48 text-sm font-bold"
                    placeholder="Nama Lengkap"
                  />
                  <Button size="sm" onClick={handleUpdateProfile} disabled={profileLoading}>
                    {profileLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingProfile(false)} disabled={profileLoading}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-primary truncate">{fullname || "Admin LPP"}</h2>
                  <button onClick={() => setIsEditingProfile(true)} className="text-muted-foreground hover:text-primary" aria-label="Edit profil">
                    <Edit className="h-3 w-3" />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Login Terakhir</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long" })}</p>
          </div>
        </div>

        <div className="bg-primary-deep text-white p-6 rounded-sm flex flex-col justify-center gap-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Aksi Cepat</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/admin/news/new" className="bg-white/10 hover:bg-white/20 p-2 rounded text-center text-[10px] font-bold transition-colors">
              BARU
            </Link>
            <Link to="/" target="_blank" className="bg-white/10 hover:bg-white/20 p-2 rounded text-center text-[10px] font-bold transition-colors">
              LIHAT WEB
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Berita", value: stats.total, icon: FileText, color: "bg-primary text-primary-foreground" },
          { label: "Dipublikasi", value: stats.published, icon: FileCheck2, color: "bg-gold text-gold-foreground" },
          { label: "Draft", value: stats.draft, icon: FileText, color: "bg-secondary text-primary" },
          { label: "Total Views Berita", value: fullNumber(stats.views), icon: Eye, color: "bg-foreground text-background" },
        ].map((s) => (
          <div key={s.label} className="bg-background p-5 rounded-sm border border-border shadow-sm hover:border-primary/20 transition-colors">
            <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${s.color} mb-3`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-display font-black text-3xl">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2">
          <div>
            <h2 className="font-brand font-extrabold text-base uppercase tracking-wide flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Analytic Pengunjung
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Data kunjungan dihitung dari tracking internal website. {analyticsSummary.hasAnalytics ? "Periode ringkas: 30 hari terakhir." : "Tracking mulai terkumpul setelah fitur ini aktif."}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {analyticsSummary.totalTrackedArticleViews > 0 && `${fullNumber(analyticsSummary.totalTrackedArticleViews)} view berita terekam dari tracker`}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Page Views 30 Hari", value: fullNumber(analyticsSummary.pageViews30), icon: Activity },
            { label: "Pengunjung Unik", value: fullNumber(analyticsSummary.uniqueVisitors30), icon: Users },
            { label: "Views Berita 30 Hari", value: fullNumber(analyticsSummary.articleViews30), icon: MousePointerClick },
            { label: "Rata-rata / Berita", value: fullNumber(avgViews), icon: TrendingUp },
          ].map((item) => (
            <div key={item.label} className="bg-background border border-border rounded-sm p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-display text-2xl font-black">{item.value}</p>
                </div>
                <div className="h-10 w-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-[1.35fr_0.95fr] gap-4">
          <div className="bg-background border border-border rounded-sm p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">Tren Kunjungan</h3>
                <p className="text-xs text-muted-foreground">Page views, pengunjung unik, dan views berita per hari.</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">14 Hari</span>
            </div>
            <ChartContainer config={chartConfig} className="h-[290px] w-full">
              <AreaChart data={analyticsSummary.trendData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="pageViews" stroke="var(--color-pageViews)" fill="var(--color-pageViews)" fillOpacity={0.18} strokeWidth={2.5} name="Page Views" />
                <Area type="monotone" dataKey="visitors" stroke="var(--color-visitors)" fill="var(--color-visitors)" fillOpacity={0.18} strokeWidth={2.5} name="Pengunjung" />
                <Area type="monotone" dataKey="articleViews" stroke="var(--color-articleViews)" fill="var(--color-articleViews)" fillOpacity={0.16} strokeWidth={2.5} name="Views Berita" />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="bg-background border border-border rounded-sm p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">Berita Paling Dilihat</h3>
                <p className="text-xs text-muted-foreground">Gabungan views lama dan tracker baru.</p>
              </div>
              {mostViewed && <span className="text-xs font-black text-primary">{compactNumber(mostViewed.displayViews)}</span>}
            </div>
            <ChartContainer config={chartConfig} className="h-[290px] w-full">
              <BarChart data={analyticsSummary.topNews.map((item) => ({ title: item.title.length > 26 ? `${item.title.slice(0, 26)}...` : item.title, views: item.displayViews }))} layout="vertical" margin={{ top: 0, right: 12, left: 12, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="4 4" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="title" tickLine={false} axisLine={false} width={136} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" radius={[0, 4, 4, 0]} fill="var(--color-views)" name="Views" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-background border border-border rounded-sm p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">Performa Kategori</h3>
                <p className="text-xs text-muted-foreground">Total views berita berdasarkan kategori konten.</p>
              </div>
            </div>
            <div className="space-y-3">
              {(analyticsSummary.categoryViews.length ? analyticsSummary.categoryViews : [{ category: "Belum ada data", views: 0 }]).map((item, index) => {
                const max = Math.max(...analyticsSummary.categoryViews.map((row) => row.views), 1);
                return (
                  <div key={item.category} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-sm font-bold truncate">{item.category}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">{fullNumber(item.views)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full ${index === 0 ? "bg-primary" : index === 1 ? "bg-gold" : "bg-primary/45"}`} style={{ width: `${Math.max(4, (item.views / max) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-background border border-border rounded-sm p-5 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wide">Sumber Kunjungan</h3>
            <p className="text-xs text-muted-foreground mb-4">Referral 30 hari terakhir.</p>
            <div className="space-y-3">
              {(analyticsSummary.referrerRows.length ? analyticsSummary.referrerRows : [{ source: "Belum ada data", views: 0 }]).map((item, index) => (
                <div key={item.source} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--gold))" : "hsl(var(--primary-glow))" }} />
                    <span className="text-sm font-semibold truncate">{item.source}</span>
                  </div>
                  <span className="text-xs font-bold tabular-nums">{fullNumber(item.views)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide">Aktivitas View Terbaru</h3>
              <p className="text-xs text-muted-foreground">Kunjungan publik terbaru yang masuk ke tracker internal.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
            {(analyticsSummary.recentViews.length ? analyticsSummary.recentViews : []).map((event, index) => (
              <div key={`${event.created_at}-${index}`} className="border border-border rounded-sm p-3 bg-muted/20 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Eye className="h-3 w-3" /> {event.page_type === "article" ? "Berita" : "Halaman"}
                </div>
                <p className="mt-2 text-sm font-bold line-clamp-2">{event.article_title || event.path || "Website"}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {event.date.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
            {!analyticsSummary.recentViews.length && (
              <div className="md:col-span-2 xl:col-span-4 border border-dashed border-border rounded-sm p-6 text-center text-sm text-muted-foreground">
                Belum ada aktivitas pengunjung yang terekam.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="bg-background rounded-sm border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h2 className="font-brand font-extrabold text-base uppercase tracking-wide">Manajemen Konten</h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Judul</th>
                  <th className="text-left px-3 py-3 font-bold">Kategori</th>
                  <th className="text-left px-3 py-3 font-bold">Status</th>
                  <th className="text-left px-3 py-3 font-bold">Media</th>
                  <th className="text-right px-3 py-3 font-bold">Views</th>
                  <th className="text-left px-3 py-3 font-bold">Tanggal</th>
                  <th className="text-right px-5 py-3 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analyticsSummary.displayNews.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {n.image_url ? (
                          <img src={n.image_url} alt="" className="h-10 w-14 object-cover rounded-sm shrink-0 shadow-sm" />
                        ) : (
                          <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center shrink-0">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="font-bold line-clamp-2 max-w-md group-hover:text-primary transition-colors">{n.title}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className="px-2 py-1 bg-muted rounded-full font-medium">{n.category}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${n.status === "published" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        {n.image_url && <ImageIcon className="h-4 w-4 text-primary" />}
                        {n.video_url && <Video className="h-4 w-4 text-gold" />}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{fullNumber(n.displayViews)}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(n.published_at ?? n.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {n.status === "published" && (
                          <Link to={`/berita/${n.slug}`} target="_blank" className="p-2 hover:bg-primary hover:text-white rounded-sm transition-all" title="Lihat">
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link to={`/admin/news/${n.id}/edit`} className="p-2 hover:bg-primary hover:text-white rounded-sm transition-all" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(n.id, n.title)} className="p-2 hover:bg-breaking hover:text-white rounded-sm transition-all" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
