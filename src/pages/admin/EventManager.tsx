import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, Calendar, Link as LinkIcon, Upload, Image as ImageIcon } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("featured_events")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setEvents(data);
    } catch (error: any) {
      toast.error(`Gagal memuat data event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchEvents(); 
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { 
      toast.error("Silakan pilih file gambar terlebih dahulu"); 
      return; 
    }

    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `banner_${Date.now()}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from("news-media")
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("news-media").getPublicUrl(filePath);
      const url = urlData.publicUrl;

      // Nonaktifkan banner lama sebelum mengaktifkan yang baru
      await supabase.from("featured_events").update({ is_active: false }).eq("is_active", true);

      const payload = {
        title: formData.title,
        event_date: new Date(formData.event_date).toISOString(),
        instagram_url: formData.instagram_url || null,
        banner_url: url,
        is_active: true
      };

      const { error: insertError } = await supabase.from("featured_events").insert([payload]);
      if (insertError) throw insertError;

      toast.success("Banner Event Besar Berhasil Diaktifkan!");
      setFormData({ title: "", event_date: "", instagram_url: "" });
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById('banner-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await fetchEvents();
    } catch (error: any) {
      toast.error(`Gagal menyimpan data: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      if (!currentStatus) {
        await supabase.from("featured_events").update({ is_active: false }).eq("is_active", true);
      }
      const { error } = await supabase.from("featured_events").update({ is_active: !currentStatus }).eq("id", id);
      if (error) throw error;
      toast.success("Status keaktifan banner diperbarui!");
      await fetchEvents();
    } catch (error: any) {
      toast.error(`Gagal mengubah status: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus data banner ini secara permanen?")) return;
    try {
      const { error } = await supabase.from("featured_events").delete().eq("id", id);
      if (error) throw error;
      toast.success("Banner dihapus");
      await fetchEvents();
    } catch (error: any) {
      toast.error(`Gagal menghapus: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-screen">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Manajemen Banner & Countdown</h2>
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">Atur Banner Event Besar & Hitung Mundur Beranda</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama / Judul Event besar</label>
            <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Cth: Pelantikan & Raker PC IPNU IPPNU" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calendar className="h-4 w-4" /> Tanggal & Waktu Event</label>
            <input type="datetime-local" className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} required />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Link Postingan Instagram (HREF)</label>
            <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})} placeholder="Cth: https://www.instagram.com/p/xxxxx/" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Upload className="h-4 w-4" /> Desain Banner (8x2 / Landscape)</label>
            <input id="banner-file" type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2.5 border rounded-2xl text-xs bg-white cursor-pointer" required />
          </div>
        </div>

        {imagePreview && (
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Live Preview Banner Terpilih:</label>
            <div className="w-full aspect-[8/2.2] border rounded-2xl overflow-hidden bg-slate-100">
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button type="submit" disabled={uploading} className="bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-4 rounded-2xl text-sm font-black shadow-xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50">
            {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {uploading ? "SEDANG MENGUNGGAH..." : "AKTIFKAN BANNER EVENT"}
          </button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-slate-200 overflow-hidden bg-white shadow-md">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-5 border-b">Preview Banner</th>
              <th className="p-5 border-b">Detail Event</th>
              <th className="p-5 border-b text-center">Status Beranda</th>
              <th className="p-5 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto text-emerald-800" /></td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400 italic">Belum ada banner event besar aktif.</td>
              </tr>
            ) : (
              events.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5"><img src={ev.banner_url} className="h-12 w-32 object-cover rounded-xl border" /></td>
                  <td className="p-5">
                    <div className="font-black text-slate-800 uppercase text-sm">{ev.title}</div>
                    <div className="text-xs text-slate-400 font-semibold mt-1">{new Date(ev.event_date).toLocaleString("id-ID")}</div>
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={() => toggleActive(ev.id, ev.is_active)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${ev.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                      {ev.is_active ? "🔴 TAYANG" : "OFF"}
                    </button>
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleDelete(ev.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl border border-red-100 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};