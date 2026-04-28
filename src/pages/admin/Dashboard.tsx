import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Edit, Trash2, Eye, FileText, FileCheck2, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

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

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [news, setNews] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (showError = true) => {
    setLoading(true);
    // Retry hingga 3x untuk mengatasi koneksi awal yang belum siap
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from("news")
        .select("id,title,slug,category,status,views,image_url,video_url,published_at,created_at,author_name")
        .order("created_at", { ascending: false });

      if (!error) {
        setNews((data ?? []) as NewsRow[]);
        setLoading(false);
        return;
      }
      lastError = error;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 300 + attempt * 500));
    }
    if (showError && lastError) {
      toast.error("Gagal memuat berita", { description: lastError.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Dashboard — IPNU IPPNU Bekasi";
    // Tunggu auth siap sebelum query (RLS butuh auth.uid())
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [authLoading, user]);

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

  const stats = {
    total: news.length,
    published: news.filter((n) => n.status === "published").length,
    draft: news.filter((n) => n.status === "draft").length,
    views: news.reduce((s, n) => s + n.views, 0),
  };

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
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Berita", value: stats.total, icon: FileText, color: "bg-primary text-primary-foreground" },
          { label: "Dipublikasi", value: stats.published, icon: FileCheck2, color: "bg-gold text-gold-foreground" },
          { label: "Draft", value: stats.draft, icon: FileText, color: "bg-secondary text-primary" },
          { label: "Total Views", value: stats.views.toLocaleString("id-ID"), icon: Eye, color: "bg-foreground text-background" },
        ].map((s) => (
          <div key={s.label} className="bg-background p-5 rounded-sm border border-border">
            <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${s.color} mb-3`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-display font-black text-3xl">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* News table */}
      <div className="bg-background rounded-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-brand font-extrabold text-base uppercase tracking-wide">Semua Berita</h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : news.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">Belum ada berita. Mulai tulis berita pertama Anda.</p>
            <Link
              to="/admin/news/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-brand font-bold text-sm"
            >
              <PlusCircle className="h-4 w-4" /> Tulis Berita Pertama
            </Link>
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
                {news.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {n.image_url ? (
                          <img src={n.image_url} alt="" className="h-10 w-14 object-cover rounded-sm shrink-0" />
                        ) : (
                          <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center shrink-0">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="font-bold line-clamp-2 max-w-md">{n.title}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">{n.category}</td>
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
                    <td className="px-3 py-3 text-right tabular-nums">{n.views.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(n.published_at ?? n.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {n.status === "published" && (
                          <Link to={`/berita/${n.slug}`} target="_blank" className="p-2 hover:bg-muted rounded-sm" title="Lihat">
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link to={`/admin/news/${n.id}/edit`} className="p-2 hover:bg-muted rounded-sm" title="Edit">
                          <Edit className="h-4 w-4 text-primary" />
                        </Link>
                        <button onClick={() => handleDelete(n.id, n.title)} className="p-2 hover:bg-muted rounded-sm" title="Hapus">
                          <Trash2 className="h-4 w-4 text-breaking" />
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
