import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowLeft, Save, Send, X, Loader2, 
  Image as ImageIcon, Video, Link2, 
  Plus, Trash2, Globe, ChevronLeft, ChevronRight, Star,
  AlertCircle, CalendarDays
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

  // STATE KONTEN & BACKDATE
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("Kegiatan IPNU");
  const [tags, setTags] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 16));
  
  // STATE MEDIA & LINK LUAR (IG/YT)
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]); 
  const [videoUrlInput, setVideoUrlInput] = useState(""); 
  
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [existingDates, setExistingDates] = useState<string[]>([]);

  // ==========================================
  // FITUR AUTOSAVE 1: AMBIL DRAF JIKA ADA (HANYA UNTUK TULIS BARU)
  // ==========================================
  useEffect(() => {
    if (!isEdit) {
      const savedDraft = localStorage.getItem("news_draft_new");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.title) setTitle(draft.title);
          if (draft.excerpt) setExcerpt(draft.excerpt);
          if (draft.content) setContent(draft.content);
          if (draft.category) setCategory(draft.category);
          if (draft.tags) setTags(draft.tags);
          if (draft.publishedAt) setPublishedAt(draft.publishedAt);
          if (draft.images) setImages(draft.images);
          if (draft.videos) setVideos(draft.videos);
          if (draft.videoUrlInput) setVideoUrlInput(draft.videoUrlInput);
          
          toast.success("Draf tulisan lu otomatis dipulihkan, Lan! Tinggal lanjutin 👍");
        } catch (e) {
          console.error("Gagal load draft:", e);
        }
      }
    }
  }, [isEdit]);

  // ==========================================
  // FITUR AUTOSAVE 2: REKAM SETIAP KETIKAN KE LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    if (!isEdit) {
      const draftData = {
        title,
        excerpt,
        content,
        category,
        tags,
        publishedAt,
        images,
        videos,
        videoUrlInput
      };
      localStorage.setItem("news_draft_new", JSON.stringify(draftData));
    }
  }, [title, excerpt, content, category, tags, publishedAt, images, videos, videoUrlInput, isEdit]);

  useEffect(() => {
    document.title = `${isEdit ? "Edit" : "Tulis"} Berita — IPNU IPPNU Bekasi`;
    fetchExistingNewsDates();

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
      setPublishedAt(new Date(data.published_at || data.created_at).toISOString().slice(0, 16));
      
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

  const fetchExistingNewsDates = async () => {
    try {
      const { data } = await supabase.from("news").select("published_at").gte("published_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());
      if (data) setExistingDates(data.map(n => n.published_at ? new Date(n.published_at).toISOString().split('T')[0] : ""));
    } catch (err) { console.error(err); }
  };

  const getEmptyDates = () => {
    const empty = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const ds = checkDate.toISOString().split('T')[0];
      if (!existingDates.includes(ds)) {
        empty.push({ raw: ds, display: checkDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) });
      }
    }
    return empty;
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const handleParallelUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video") => {
    const files = e.target.files;
    if (!files || !user || !canManageNews) return;
    setUploading(kind);
    try {
      const results = await Promise.all(Array.from(files).map(async (file) => {
        const path = `${user.id}/${kind}s/${Date.now()}-${file.name}`;
        await supabase.storage.from("news-media").upload(path, file);
        return supabase.storage.from("news-media").getPublicUrl(path).data.publicUrl;
      }));
      if (kind === "image") setImages(prev => [...prev, ...results]);
      else setVideos(prev => [...prev, ...results]);
      toast.success("Media terunggah!");
    } catch (err) { toast.error("Gagal upload"); } finally { setUploading(null); }
  };

  const save = async (status: "draft" | "published") => {
    const parsed = schema.safeParse({ title, excerpt, content, category });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSaving(true);
    const slug = isEdit ? undefined : `${slugify(title)}-${Date.now().toString(36)}`;
    const finalVideoUrl = videoUrlInput.trim() !== "" ? videoUrlInput : (videos[0] || null);

    const payload = {
      ...parsed.data,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      image_url: images[0] || null,
      video_url: finalVideoUrl,
      status,
      author_id: user?.id,
      author_name: user?.email?.split("@")[0] ?? "Admin",
      published_at: status === "published" ? new Date(publishedAt).toISOString() : null,
      created_at: status === "published" ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      ...(slug ? { slug } : {}),
    };

    const res = isEdit ? await supabase.from("news").update(payload).eq("id", id!) : await supabase.from("news").insert(payload as any);
    setSaving(false);
    if (!res.error) {
      // ==========================================
      // FITUR AUTOSAVE 3: BERSIHKAN LOCALSTORAGE JIKA SUKSES SUBMIT
      // ==========================================
      if (!isEdit) {
        localStorage.removeItem("news_draft_new");
      }
      toast.success("Mantap Lan!"); 
      navigate("/admin/dashboard"); 
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <AdminLayout 
      title={isEdit ? "Edit Berita" : "Tulis Berita Baru"}
      action={
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-muted rounded-sm text-slate-500">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      }
    >
      <div className="grid lg:grid-cols-[1fr_350px] gap-8 max-w-7xl mx-auto">
        
        {/* KOLOM KIRI */}
        <div className="space-y-6">
          {!isEdit && (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <h3 className="text-[10px] font-black text-amber-900 uppercase">Klik slot tanggal untuk Backdate:</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {getEmptyDates().map((date, i) => (
                  <button 
                    type="button"
                    key={i} 
                    onClick={() => setPublishedAt(`${date.raw}T09:00`)} 
                    className="bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-sm text-[9px] font-black hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                  >
                    {date.display}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-sm border shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-primary">Judul Berita *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full text-2xl font-bold border-b p-2 focus:outline-none focus:border-primary bg-transparent" placeholder="Judul berita..." />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-primary">Isi Berita *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full min-h-[500px] p-2 focus:outline-none resize-none border border-border rounded-sm text-base leading-relaxed" placeholder="Tulis berita lengkap..." />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-sm border shadow-sm space-y-3">
            <button onClick={() => save("published")} disabled={saving} className="w-full py-3 bg-primary text-white text-[10px] font-black uppercase rounded-sm flex items-center justify-center gap-2">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} TERBITKAN
            </button>
            <button onClick={() => save("draft")} disabled={saving} className="w-full py-3 bg-muted text-[10px] font-black uppercase rounded-sm">SIMPAN DRAFT</button>
          </div>

          <div className="bg-white p-5 rounded-sm border shadow-sm">
            <label className="block text-[10px] font-black uppercase mb-3 text-primary flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" /> Tanggal Terbit (Backdate)
            </label>
            <input type="datetime-local" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} className="w-full p-2.5 text-xs font-bold border rounded-sm bg-slate-50" />
          </div>

          <div className="bg-white p-5 rounded-sm border shadow-sm">
            <label className="block text-[10px] font-black uppercase mb-2 text-primary">Ringkasan (Max 500)</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full p-2 text-xs border rounded-sm h-24 focus:outline-none focus:border-primary resize-none" maxLength={500} placeholder="Ringkasan singkat berita..." />
            <div className="text-right text-[9px] font-bold text-muted-foreground mt-1">{excerpt.length}/500</div>
          </div>

          {/* GALERI FOTO (REORDERABLE) */}
          <div className="bg-white p-5 rounded-sm border shadow-sm">
            <label className="block text-[10px] font-black uppercase mb-3 text-primary italic">Atur Urutan Foto</label>
            <div className="space-y-3">
              {images.map((url, idx) => (
                <div key={idx} className={`relative aspect-video rounded-sm overflow-hidden border-2 group transition-all ${idx === 0 ? 'border-primary' : 'border-border'}`}>
                  <img src={url} className="w-full h-full object-cover" alt="Preview Berita" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button onClick={() => moveImage(idx, 'left')} disabled={idx === 0} className="p-1.5 bg-white rounded-full text-black hover:bg-amber-400"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="p-1.5 bg-red-600 text-white rounded-full"><Trash2 className="h-4 w-4" /></button>
                    <button onClick={() => moveImage(idx, 'right')} disabled={idx === images.length - 1} className="p-1.5 bg-white rounded-full text-black hover:bg-amber-400"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Star className="h-2 w-2 fill-white" /> Utama
                    </div>
                  )}
                </div>
              ))}
              <label className="aspect-video border-2 border-dashed border-muted rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                {uploading === "image" ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                <span className="text-[8px] font-black mt-1 uppercase">Tambah Foto</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleParallelUpload(e, "image")} />
              </label>
            </div>
          </div>

          {/* UPLOAD BERKAS VIDEO */}
          <div className="bg-white p-5 rounded-sm border shadow-sm space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase mb-2 text-primary italic">Upload Berkas Video (Max 1GB)</label>
              <div className="space-y-3 mb-3">
                {videos.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-sm overflow-hidden bg-black group">
                    <video src={url} className="w-full h-full" controls />
                    <button onClick={() => setVideos(videos.filter((_, i) => i !== idx))} className="absolute top-2 right-2 h-7 w-7 bg-destructive text-white rounded-sm flex items-center justify-center shadow-lg"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <label className="aspect-video border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                {uploading === "video" ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Video className="h-4 w-4 text-muted-foreground" />}
                <span className="text-[8px] font-black uppercase mt-1">Upload Video</span>
                <input type="file" multiple accept="video/*" className="hidden" onChange={e => handleParallelUpload(e, "video")} />
              </label>
            </div>

            {/* URL EKSTERNAL (REELS / YT) */}
            <div className="pt-2 border-t">
              <label className="block text-[10px] font-black uppercase mb-2 text-primary flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" /> URL EKSTERNAL (REELS / YT)
              </label>
              <input 
                value={videoUrlInput} 
                onChange={e => setVideoUrlInput(e.target.value)} 
                placeholder="Link Instagram / Reels / YouTube" 
                className="w-full p-2.5 text-xs font-bold border rounded-sm bg-slate-50 outline-none focus:border-primary transition-all" 
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-sm border shadow-sm">
            <label className="block text-[10px] font-black uppercase mb-2 text-primary">Kategori</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2.5 text-xs font-bold border rounded-sm bg-muted/5 outline-none focus:border-primary">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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