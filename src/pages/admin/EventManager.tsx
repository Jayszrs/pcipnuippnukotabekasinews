import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Calendar, 
  Link as LinkIcon, 
  Upload, 
  Image as ImageIcon, 
  ArrowLeft, 
  Pencil, 
  X,
  Save,
  CalendarDays // Import icon tambahan untuk cek tanggal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const EventManager = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        .order("event_date", { ascending: true }); // Urutkan berdasarkan tanggal terdekat biar enak liatnya
      
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
      if (imagePreview && !imagePreview.startsWith('http')) URL.revokeObjectURL(imagePreview);
    };
  }, []);

  // --- LOGIKA CEK TANGGAL KOSONG ---
  const getEmptyDates = () => {
    if (loading) return [];
    
    // Ambil daftar tanggal yang sudah terisi di database (format string YYYY-MM-DD)
    const takenDates = events.map(e => new Date(e.event_date).toISOString().split('T')[0]);
    const emptySlots = [];
    const today = new Date();

    // Kita cek slot untuk 14 hari ke depan
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() + i);
      const dateString = checkDate.toISOString().split('T')[0];

      if (!takenDates.includes(dateString)) {
        // Jika tanggal belum ada di database, masukkan ke daftar "kosong"
        emptySlots.push({
          raw: dateString,
          display: checkDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        });
      }
    }
    return emptySlots;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ title: "", event_date: "", instagram_url: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    const fileInput = document.getElementById('banner-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const startEdit = (event: any) => {
    setEditingId(event.id);
    const date = new Date(event.event_date);
    const formattedDate = date.toISOString().slice(0, 16);
    
    setFormData({
      title: event.title,
      event_date: formattedDate,
      instagram_url: event.instagram_url || "",
    });
    setImagePreview(event.banner_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `banner_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("news-media")
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("news-media").getPublicUrl(filePath);
        finalImageUrl = urlData.publicUrl;
      }

      if (!finalImageUrl) throw new Error("Gambar banner wajib ada");

      const payload = {
        title: formData.title,
        event_date: new Date(formData.event_date).toISOString(),
        instagram_url: formData.instagram_url || null,
        banner_url: finalImageUrl,
      };

      if (editingId) {
        const { error: updateError } = await supabase.from("featured_events").update(payload).eq("id", editingId);
        if (updateError) throw updateError;
        toast.success("Berhasil diupdate!");
      } else {
        await supabase.from("featured_events").update({ is_active: false }).eq("is_active", true);
        const { error: insertError } = await supabase.from("featured_events").insert([{ ...payload, is_active: true }]);
        if (insertError) throw insertError;
        toast.success("Banner baru aktif!");
      }

      resetForm();
      await fetchEvents();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
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
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus banner ini?")) return;
    try {
      await supabase.from("featured_events").delete().eq("id", id);
      toast.success("Terhapus");
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-2 text-slate-500 hover:text-emerald-800 transition-colors mb-2 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {editingId ? "Edit Banner" : "Manajemen Banner"}
          </h2>
        </div>
      </div>

      {/* --- WIDGET TANGGAL KOSONG --- */}
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-emerald-800 p-2 rounded-xl text-white">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider">Slot Tanggal Kosong</h3>
            <p className="text-[9px] text-emerald-700/70 font-bold uppercase">Lu belum upload banner untuk tanggal-tanggal di bawah ini:</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {getEmptyDates().length > 0 ? (
            getEmptyDates().map((date, idx) => (
              <button 
                key={idx}
                onClick={() => setFormData({...formData, event_date: `${date.raw}T08:00`})}
                className="bg-white border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm hover:bg-emerald-800 hover:text-white transition-all"
              >
                {date.display}
              </button>
            ))
          ) : (
            <span className="text-[10px] text-emerald-600 italic">Semua slot tanggal sudah terisi mantap!</span>
          )}
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className={`p-6 border rounded-[2rem] space-y-6 ${editingId ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Judul Event</label>
            <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Tanggal & Waktu</label>
            <input type="datetime-local" className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} required />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Link Instagram</label>
            <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">File Banner</label>
            <input id="banner-file" type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2.5 border rounded-2xl text-[10px] bg-white" required={!editingId} />
          </div>
        </div>

        {imagePreview && (
          <div className="w-full aspect-[8/2.2] border rounded-2xl overflow-hidden bg-slate-100">
            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={uploading} className={`${editingId ? 'bg-amber-600' : 'bg-emerald-800'} text-white px-10 py-4 rounded-2xl text-xs font-black shadow-xl flex items-center gap-3 transition-all`}>
            {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : (editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
            {uploading ? "PROSES..." : (editingId ? "SIMPAN PERUBAHAN" : "AKTIFKAN BANNER")}
          </button>
        </div>
      </form>

      {/* Tabel */}
      <div className="rounded-[2rem] border border-slate-200 overflow-hidden bg-white shadow-md">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
              <th className="p-5">Visual</th>
              <th className="p-5">Detail Acara</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map(ev => (
              <tr key={ev.id} className={`hover:bg-slate-50/50 ${editingId === ev.id ? 'bg-amber-50/30' : ''}`}>
                <td className="p-5"><img src={ev.banner_url} className="h-10 w-28 object-cover rounded-lg border shadow-sm" /></td>
                <td className="p-5">
                  <div className="font-black text-slate-800 uppercase text-[11px]">{ev.title}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(ev.event_date).toLocaleString("id-ID")}</div>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => toggleActive(ev.id, ev.is_active)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${ev.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-300 border-slate-200'}`}>
                    {ev.is_active ? "● TAYANG" : "OFF"}
                  </button>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => startEdit(ev)} className="p-2.5 text-slate-400 hover:text-amber-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(ev.id)} className="p-2.5 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};