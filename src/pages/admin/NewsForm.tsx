import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowLeft, Save, Send, X, Loader2, 
  Image as ImageIcon, Video, Link2, 
  Plus, Trash2, Globe, ChevronLeft, ChevronRight, Star
} from "lucide-react"; 
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
  const { user, role } = useAuth();
  const canManageNews = role === "admin" || role === "editor";

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("Kegiatan IPNU");
  const [tags, setTags] = useState("");
  
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]); 
  const [videoUrlInput, setVideoUrlInput] = useState("");
  
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
      
      if (data.image_url) setImages(Array.isArray(data.image_url) ? data.image_url : [data.image_url]); 
      if (data.video_url) {
        if (data.video_url.includes("/storage/v1/object/public/")) {
          setVideos([data.video_url]);
        } else {
          setVideoUrlInput(data.video_url);
        }
      }
      setLoading(false);
    })();
  }, [id, isEdit, navigate]);

  // --- LOGIKA GESER FOTO (REORDER) ---
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;

    // Swap posisi array
    const temp = newImages[index];
    newImages[index] = newImages[newIndex];
    newImages[newIndex] = temp;
    
    setImages(newImages);
  };

  const handleParallelUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video") => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user || !canManageNews) return;

    setUploading(kind);
    const fileArray = Array.from(files);
    
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const maxMB = 1024; 
        if (file.size > maxMB * 1024 * 1024) throw new Error(`File ${file.name} terlalu besar!`);

        const ext = file.name.split(".").pop();
        const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 11);
        const path = `${user.id}/${kind}s/${uniqueId}.${ext}`;

        const { error: uploadError } = await supabase.storage.from("news-media").upload(path, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("news-media").getPublicUrl(path);
        return data.publicUrl;
      });

      const results = await Promise.all(uploadPromises);
      
      if (kind === "image") setImages((prev) => [...prev, ...results]);
      else setVideos((prev) => [...prev, ...results]);
      
      toast.success(`${results.length} media berhasil diunggah!`);
    } catch (err: any) {
      toast.error("Gagal upload", { description: err.message });
    } finally {
      setUploading(null);
    }
  };

  const save = async (status: "draft" | "published") => {
    const parsed = schema.safeParse({ title, excerpt, content, category });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSaving(true);
    const slug = isEdit ? undefined : `${slugify(title)}-${Date.now().toString(36)}`;
    const finalVideoUrl = videoUrlInput.trim() !== "" ? videoUrlInput : (videos[0] || null);

    const payload = {
      ...parsed.data,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      image_url: images[0] || null, // Foto di index 0 otomatis jadi Poster Utama
      video_url: finalVideoUrl,
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
    if (!res.error) {
      toast.success(status === "published" ? "Berita Terbit!" : "Draft Aman");
      navigate("/admin/dashboard");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <AdminLayout 
      title={isEdit ? "Edit Berita" : "Tulis Berita Baru"}
      action={
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-muted rounded-sm">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      }
    >
      <div className="grid lg:grid-cols-[1fr_350px] gap-8 max-w-7xl mx-auto">
        
        {/* KOLOM KIRI: EDITOR */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-border shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Judul Berita *</label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul berita..."
              className="w-full px-0 py-2 text-2xl font-bold border-b border-border focus:border-primary focus:outline-none bg-transparent"
            />
          </div>

          <div className="bg-white p-6 rounded-sm border border-border shadow-sm text-right">
            <label className="block text-left text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Ringkasan Singkat *</label>
            <textarea
              value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              className="w-full p-0 border-none focus:ring-0 text-sm resize-none"
              rows={3} maxLength={500}
            />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">{excerpt.length}/500</span>
          </div>

          <div className="bg-white p-6 rounded-sm border border-border shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Isi Berita *</label>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[500px] p-0 border-none focus:ring-0 text-base leading-relaxed"
            />
          </div>
        </div>

        {/* KOLOM KANAN: SIDEBAR */}
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-sm border border-border shadow-sm space-y-3">
            <button onClick={() => save("published")} disabled={saving || uploading !== null} className="w-full py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center justify-center gap-2 transition-all">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} PUBLIKASIKAN
            </button>
            <button onClick={() => save("draft")} disabled={saving || uploading !== null} className="w-full py-3 bg-muted text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-muted/80 transition-all">
              SIMPAN DRAFT
            </button>
          </div>

          {/* GALERI FOTO DENGAN FITUR GESER */}
          <div className="bg-white p-5 rounded-sm border border-border shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-primary italic">Atur Urutan Foto</label>
            <div className="space-y-3">
              {images.map((url, idx) => (
                <div key={idx} className={`relative aspect-video rounded-sm overflow-hidden border-2 group transition-all ${idx === 0 ? 'border-primary' : 'border-border'}`}>
                  <img src={url} className="w-full h-full object-cover" />
                  
                  {/* Overlay Kontrol Geser */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => moveImage(idx, 'left')} 
                      disabled={idx === 0}
                      className="p-1.5 bg-white text-black rounded-full disabled:opacity-30 hover:bg-gold transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="p-1.5 bg-destructive text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => moveImage(idx, 'right')} 
                      disabled={idx === images.length - 1}
                      className="p-1.5 bg-white text-black rounded-full disabled:opacity-30 hover:bg-gold transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Indikator Utama */}
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-lg">
                      <Star className="h-2 w-2 fill-white" /> Utama
                    </div>
                  )}
                  <div className="absolute bottom-1 right-2 text-white text-[10px] font-black drop-shadow-md">#{idx + 1}</div>
                </div>
              ))}
              
              <label className="aspect-video border-2 border-dashed border-muted rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                {uploading === "image" ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                <span className="text-[8px] font-black mt-1 uppercase">Tambah Foto (Max 1GB)</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleParallelUpload(e, "image")} />
              </label>
            </div>
            <p className="mt-3 text-[8px] text-muted-foreground italic text-center">Gunakan panah di gambar untuk mengatur urutan. Foto teratas (#1) akan jadi poster berita.</p>
          </div>

          {/* UPLOAD VIDEO (LIMIT 1GB) */}
          <div className="bg-white p-5 rounded-sm border border-border shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary italic">Upload Berkas Video</label>
            <div className="space-y-3 mb-3">
              {videos.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-sm overflow-hidden bg-black group">
                  <video src={url} className="w-full h-full" />
                  <button onClick={() => setVideos(videos.filter((_, i) => i !== idx))} className="absolute top-2 right-2 h-7 w-7 bg-destructive text-white rounded-sm flex items-center justify-center shadow-lg"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-muted rounded-sm cursor-pointer hover:border-gold hover:bg-gold/5 transition-all group">
              {uploading === "video" ? <Loader2 className="h-6 w-6 animate-spin text-gold" /> : <Video className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-gold transition-colors" />}
              <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Video (Max 1GB)</span>
              <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => handleParallelUpload(e, "video")} />
            </label>
          </div>

          {/* URL EKSTERNAL */}
          <div className="bg-white p-5 rounded-sm border border-border shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary italic">URL Eksternal (Reels / YT)</label>
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                value={videoUrlInput} 
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Link Instagram / Reels / YouTube" 
                className="w-full pl-9 pr-3 py-3 text-xs font-bold border border-border rounded-sm bg-muted/10 outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-sm border border-border shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary">Tags Berita</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ipnu, ippnu, bekasi" className="w-full p-2.5 text-xs font-bold border border-border rounded-sm bg-muted/5 outline-none focus:border-primary" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsForm;