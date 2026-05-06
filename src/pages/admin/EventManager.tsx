import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, Calendar, Link as LinkIcon, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const EventManager = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    instagram_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("featured_events")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleUpload = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `banner_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("news-media") // Menggunakan bucket publik milikmu
      .upload(filePath, imageFile);
    
    if (uploadError) {
      toast.error("Gagal mengunggah gambar banner");
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from("news-media").getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = await handleUpload();
    if (!url) { toast.error("Silakan pilih file gambar terlebih dahulu"); return; }

    // Nonaktifkan banner lain terlebih dahulu agar fokus ke event terbaru
    await supabase.from("featured_events").update({ is_active: false }).eq("is_active", true);

    const payload = {
      title: formData.title,
      event_date: new Date(formData.event_date).toISOString(),
      instagram_url: formData.instagram_url,
      banner_url: url,
      is_active: true
    };

    const { error } = await supabase.from("featured_events").insert([payload]);

    if (!error) {
      toast.success("Banner Event Besar Berhasil Diaktifkan!");
      setFormData({ title: "", event_date: "", instagram_url: "" });
      setImageFile(null);
      const fileInput = document.getElementById('banner-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchEvents();
    } else {
      toast.error("Gagal menyimpan data event");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    if (!currentStatus) {
      // Nonaktifkan semua terlebih dahulu jika ingin mengaktifkan yang ini
      await supabase.from("featured_events").update({ is_active: false }).eq("is_active", true);
    }
    await supabase.from("featured_events").update({ is_active: !currentStatus }).eq("id", id);
    fetchEvents();
    toast.success("Status keaktifan banner diperbarui");
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-border p-6 shadow-sm min-h-screen">
      <div>
        <h2 className="text-2xl font-brand font-black text-primary uppercase tracking-tight">Manajemen Banner & Countdown</h2>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">Atur Banner Event Besar & Hitung Mundur Beranda</p>
      </div>

      {/* FORM INPUT BANNER */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama / Judul Event besar</label>
            <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Cth: Pelantikan & Raker PC IPNU IPPNU" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calendar className="h-4 w-4" /> Tanggal & Waktu Event</label>
            <input type="datetime-local" className="w-full p-3.5 border rounded-2xl text-sm bg-white cursor-pointer" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} required />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Link Postingan Instagram (HREF)</label>
            <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})} placeholder="Cth: https://www.instagram.com/p/xxxxx/" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Upload className="h-4 w-4" /> Desain Banner (8x2 / Landscape)</label>
            <input id="banner-file" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full p-2.5 border rounded-2xl text-xs bg-white cursor-pointer" required />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button type="submit" disabled={uploading} className="bg-primary hover:bg-primary-deep text-white px-10 py-4 rounded-2xl text-sm font-black shadow-xl flex items-center gap-3 transition-all active:scale-95">
            {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : <Plus className="h-5 w-5" />}
            AKTIFKAN BANNER EVENT
          </button>
        </div>
      </form>

      {/* TABEL LIST BANNER */}
      <div className="rounded-[2rem] border border-border overflow-hidden bg-white shadow-md">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-5 border-b">Preview Banner</th>
              <th className="p-5 border-b">Detail Event</th>
              <th className="p-5 border-b text-center">Status Beranda</th>
              <th className="p-5 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map(ev => (
              <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <img src={ev.banner_url} className="h-16 w-40 object-cover rounded-xl border" alt="Banner" />
                </td>
                <td className="p-5">
                  <div className="font-black text-slate-900 uppercase text-sm">{ev.title}</div>
                  <div className="text-xs text-muted-foreground font-semibold mt-1">{new Date(ev.event_date).toLocaleString("id-ID")}</div>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => toggleActive(ev.id, ev.is_active)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${ev.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {ev.is_active ? "🔴 TAYANG" : "OFF"}
                  </button>
                </td>
                <td className="p-5 text-center">
                  <button onClick={async () => { if(window.confirm("Hapus data banner ini?")) { await supabase.from("featured_events").delete().eq("id", ev.id); fetchEvents(); toast.success("Banner dihapus"); }}} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl border border-red-100 transition-all"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};