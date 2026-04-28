import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Save, Send, Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const CATEGORIES = ["Kegiatan IPNU", "Kegiatan IPPNU", "Bekasi Update", "Nasional", "Opini"] as const;

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);

const schema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter").max(200),
  excerpt: z.string().trim().min(20, "Ringkasan minimal 20 karakter").max(500),
  content: z.string().trim().min(50, "Isi berita minimal 50 karakter"),
  category: z.enum(CATEGORIES),
});

const NewsForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("Kegiatan IPNU");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    document.title = `${isEdit ? "Edit" : "Tulis"} Berita — IPNU IPPNU Bekasi`;
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast.error("Berita tidak ditemukan");
        navigate("/admin/dashboard");
        return;
      }
      setTitle(data.title);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setCategory(data.category);
      setTags((data.tags ?? []).join(", "));
      setImageUrl(data.image_url);
      setVideoUrl(data.video_url);
      setLoading(false);
    })();
  }, [id, isEdit, navigate]);

  const uploadFile = async (file: File, kind: "image" | "video") => {
    if (!user) return;
    const maxMB = kind === "image" ? 10 : 100;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`Ukuran maksimal ${maxMB}MB`);
      return;
    }
    setUploading(kind);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${kind}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("news-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast.error("Upload gagal", { description: error.message });
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("news-media").getPublicUrl(path);
    if (kind === "image") setImageUrl(data.publicUrl);
    else setVideoUrl(data.publicUrl);
    toast.success(`${kind === "image" ? "Foto" : "Video"} berhasil diupload`);
    setUploading(null);
  };

  const save = async (status: "draft" | "published") => {
    const parsed = schema.safeParse({ title, excerpt, content, category });
    if (!parsed.success) {
      toast.error("Periksa form", { description: parsed.error.issues[0].message });
      return;
    }
    setSaving(true);
    const slug = isEdit ? undefined : `${slugify(title)}-${Date.now().toString(36)}`;
    const payload = {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category: parsed.data.category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      image_url: imageUrl,
      video_url: videoUrl,
      status,
      author_id: user?.id,
      author_name: user?.email?.split("@")[0] ?? "Admin",
      published_at: status === "published" ? new Date().toISOString() : null,
      ...(slug ? { slug } : {}),
    };

    const res = isEdit
      ? await supabase.from("news").update(payload).eq("id", id!)
      : await supabase.from("news").insert(payload as any);

    setSaving(false);
    if (res.error) {
      toast.error("Gagal menyimpan", { description: res.error.message });
      return;
    }
    toast.success(status === "published" ? "Berita dipublikasi!" : "Draft tersimpan");
    navigate("/admin/dashboard");
  };

  if (loading) {
    return (
      <AdminLayout title="Memuat...">
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEdit ? "Edit Berita" : "Tulis Berita Baru"}
      action={
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold hover:bg-muted rounded-sm">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-7xl">
        {/* Main */}
        <div className="space-y-5">
          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Judul Berita *</label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Tulis judul yang menarik..."
              className="w-full px-4 py-3 text-xl font-display font-bold rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={200}
            />
          </div>

          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Ringkasan / Deskripsi *</label>
            <textarea
              value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat untuk preview berita..."
              rows={3} maxLength={500}
              className="w-full px-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y text-sm"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">{excerpt.length}/500</div>
          </div>

          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Isi Berita *</label>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi berita di sini... Pisahkan paragraf dengan baris kosong."
              rows={16}
              className="w-full px-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y text-base leading-relaxed font-sans"
            />
            <p className="text-xs text-muted-foreground mt-2">Tip: pisahkan paragraf dengan menekan Enter dua kali.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="bg-background p-5 rounded-sm border border-border space-y-3">
            <h3 className="font-brand font-extrabold text-sm uppercase tracking-wider">Publikasi</h3>
            <button
              onClick={() => save("published")} disabled={saving || uploading !== null}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-sm font-brand font-bold text-sm hover:opacity-95 shadow-elevated disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publikasikan
            </button>
            <button
              onClick={() => save("draft")} disabled={saving || uploading !== null}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-sm font-brand font-bold text-sm disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Simpan Draft
            </button>
          </div>

          {/* Category */}
          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Kategori *</label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Image */}
          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-3">Foto Utama</label>
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="" className="w-full aspect-video object-cover rounded-sm" />
                <button
                  onClick={() => setImageUrl(null)}
                  className="absolute top-2 right-2 h-8 w-8 bg-background/90 rounded-sm flex items-center justify-center hover:bg-breaking hover:text-breaking-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors">
                {uploading === "image" ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Klik untuk upload foto</span>
                    <span className="text-[10px] text-muted-foreground">JPG, PNG (max 10MB)</span>
                  </>
                )}
                <input
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "image")}
                />
              </label>
            )}
          </div>

          {/* Video */}
          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-3">Video (Opsional)</label>
            {videoUrl ? (
              <div className="relative">
                <video src={videoUrl} controls className="w-full aspect-video rounded-sm bg-foreground" />
                <button
                  onClick={() => setVideoUrl(null)}
                  className="absolute top-2 right-2 h-8 w-8 bg-background/90 rounded-sm flex items-center justify-center hover:bg-breaking hover:text-breaking-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-gold hover:bg-muted/30 transition-colors">
                {uploading === "video" ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gold" />
                ) : (
                  <>
                    <Video className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Klik untuk upload video</span>
                    <span className="text-[10px] text-muted-foreground">MP4, WebM (max 100MB)</span>
                  </>
                )}
                <input
                  type="file" accept="video/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")}
                />
              </label>
            )}
          </div>

          {/* Tags */}
          <div className="bg-background p-5 rounded-sm border border-border">
            <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Tags</label>
            <input
              value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="ipnu, ippnu, bekasi"
              className="w-full px-3 py-2.5 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsForm;
