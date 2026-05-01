import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlusCircle, Edit, Trash2, Eye, FileText, FileCheck2, 
  Loader2, Image as ImageIcon, Video, User, Camera, Save, Settings 
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  
  // State untuk Profil
  const [profileLoading, setProfileLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const load = async (showError = true) => {
    setLoading(true);
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

  // Fungsi ambil data profil
  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("fullname, avatar_url")
      .eq("id", user.id)
      .single();
    
    if (data) {
      setFullname(data.fullname || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  useEffect(() => {
    document.title = "Dashboard — IPNU IPPNU Bekasi";
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    load();
    fetchProfile();
  }, [authLoading, user]);

  // Fungsi Update Profil
  const handleUpdateProfile = async () => {
    setProfileLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ fullname })
      .eq("id", user?.id);
    
    if (error) {
      toast.error("Gagal update profil");
    } else {
      toast.success("Profil diperbarui!");
      setIsEditingProfile(false);
    }
    setProfileLoading(false);
  };

  // Fungsi Upload Foto
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setProfileLoading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Gagal upload foto");
    } else {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setAvatarUrl(publicUrl);
      toast.success("Foto profil diperbarui!");
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
      
      {/* 1. SEKSI PROFIL & QUICK ACTIONS (Penambahan baru agar Profesional) */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-border flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-primary/10">
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
            
            <div className="space-y-1">
              {isEditingProfile ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={fullname} 
                    onChange={(e) => setFullname(e.target.value)} 
                    className="h-8 w-48 text-sm"
                    placeholder="Nama Lengkap"
                  />
                  <Button size="sm" onClick={handleUpdateProfile} disabled={profileLoading}>
                    {profileLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-primary">{fullname || "Admin Baru"}</h2>
                  <button onClick={() => setIsEditingProfile(true)} className="text-muted-foreground hover:text-primary">
                    <Edit className="h-3 w-3" />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">Administrator</span>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Login Terakhir</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-deep text-white p-6 rounded-sm flex flex-col justify-center gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-70">Aksi Cepat</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/admin/news/new" className="bg-white/10 hover:bg-white/20 p-2 rounded text-center text-[10px] font-bold transition-colors">BARU</Link>
            <Link to="/" target="_blank" className="bg-white/10 hover:bg-white/20 p-2 rounded text-center text-[10px] font-bold transition-colors">LIHAT WEB</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Berita", value: stats.total, icon: FileText, color: "bg-primary text-primary-foreground" },
          { label: "Dipublikasi", value: stats.published, icon: FileCheck2, color: "bg-gold text-gold-foreground" },
          { label: "Draft", value: stats.draft, icon: FileText, color: "bg-secondary text-primary" },
          { label: "Total Views", value: stats.views.toLocaleString("id-ID"), icon: Eye, color: "bg-foreground text-background" },
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

      {/* News table */}
      <div className="bg-background rounded-sm border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h2 className="font-brand font-extrabold text-base uppercase tracking-wide">Manajemen Konten</h2>
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
                  <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {n.image_url ? (
                          <img src={n.image_url} alt="" className="h-10 w-14 object-cover rounded-sm shrink-0 shadow-sm" />
                        ) : (
                          <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center shrink-0">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="font-bold line-clamp-2 max-w-md hover:text-primary transition-colors">{n.title}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className="px-2 py-1 bg-muted rounded-full">{n.category}</span>
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
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{n.views.toLocaleString("id-ID")}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(n.published_at ?? n.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
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