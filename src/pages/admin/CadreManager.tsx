import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, Trash2, Loader2, Quote, Edit2, XCircle, Save,
  CheckCircle2, ArrowLeft, LayoutDashboard, Globe, MapPin, Calendar, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CadreManager = () => {
  const navigate = useNavigate();
  const [cadres, setCadres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false); 
  const [lastCreatedCadre, setLastCreatedCadre] = useState<any>(null);

  // Form State - Default khidmah disetel ke 2025 - 2028 + Fitur Hierarki & Urutan
  const [formData, setFormData] = useState({
    name: "", position: "", division: "", organization: "IPNU", 
    period_start: "2025", period_end: "2028", quote: "",
    origin: "", birth_info: "", 
    position_level: 2, // <-- INTEGRASI BARU (1: Ketua, 2: BPH, 3: Departemen)
    order_priority: 1  // <-- INTEGRASI BARU (Urutan Grid Tampil)
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const fetchCadres = async () => {
    setLoading(true);
    // Diurutkan berdasarkan level struktural dulu baru urutan prioritas
    const { data } = await supabase
      .from("cadres")
      .select("*")
      .order("position_level", { ascending: true })
      .order("order_priority", { ascending: true });
    
    if (data) setCadres(data);
    setLoading(false);
  };

  useEffect(() => { fetchCadres(); }, []);

  const handleEditInitiation = (cadre: any) => {
    setEditingId(cadre.id);
    setFormData({
      name: cadre.name,
      position: cadre.position,
      division: cadre.division,
      organization: cadre.organization,
      period_start: cadre.period_start,
      period_end: cadre.period_end,
      quote: cadre.quote || "",
      origin: cadre.origin || "",
      birth_info: cadre.birth_info || "",
      position_level: cadre.position_level ?? 2, // Load data lama / fallback BPH
      order_priority: cadre.order_priority ?? 1  // Load data lama / fallback 1
    });
    setCurrentImageUrl(cadre.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info(`Mode edit: ${cadre.name}`);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", position: "", division: "", organization: "IPNU", 
      period_start: "2025", period_end: "2028", quote: "", origin: "", birth_info: "",
      position_level: 2, order_priority: 1
    });
    setImageFile(null);
    setCurrentImageUrl(null);
    const fileInput = document.getElementById('foto-kader') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleUpload = async () => {
    if (!imageFile) return currentImageUrl;
    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `card_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from("cadres").upload(filePath, imageFile);
    if (uploadError) { 
      toast.error(`Gagal upload foto ke storage: ${uploadError.message}`); 
      setUploading(false); 
      return null; 
    }

    const { data } = supabase.storage.from("cadres").getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = await handleUpload();
    
    // Validasi pencegahan jika proses upload foto gagal di tengah jalan
    if (imageFile && !url) return;

    const payload = { ...formData, image_url: url };
    
    if (editingId) {
      // PROSES UPDATE DATA KE SUPABASE
      const { error } = await supabase.from("cadres").update(payload).eq("id", editingId);
      
      if (!error) {
        toast.success("Card Berhasil Diperbarui!");
        setLastCreatedCadre(payload);
        setIsUpdateSuccess(true); 
        setShowSuccessModal(true);    
        resetForm();
        fetchCadres();
      } else {
        toast.error(`Gagal memperbarui database: ${error.message}`);
        console.error("Detail Eror Database:", error);
      }
    } else {
      // PROSES SIMPAN BARU
      const { data, error } = await supabase.from("cadres").insert([payload]).select();
      if (!error && data) {
        toast.success("Card Berhasil Diupload!");
        setLastCreatedCadre(data[0]); 
        setIsUpdateSuccess(false); 
        setShowSuccessModal(true);    
        resetForm();
        fetchCadres();
      } else if (error) {
        toast.error(`Gagal menyimpan data baru: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-border shadow-sm overflow-hidden relative min-h-screen">
      {/* Header Panel */}
      <div className={`p-6 border-b border-border transition-colors ${editingId ? 'bg-amber-50' : 'bg-slate-50/50'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2.5 hover:bg-white rounded-xl text-primary transition-all shadow-sm border border-border group">
              <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-2xl font-display font-black text-primary uppercase tracking-tight">
                {editingId ? "Edit Card Layout" : "Tambah Card Layout"}
              </h2>
            </div>
          </div>
          {editingId && (
            <button onClick={resetForm} className="px-4 py-2 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors shadow-sm flex items-center gap-2">
              <XCircle className="h-4 w-4" /> BATAL EDIT
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-100 space-y-6">
          
          {/* BARIS 1: DATA UTAMA */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Jabatan</label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Divisi/Bidang</label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Organisasi</label>
              <select className="w-full p-3.5 border rounded-2xl text-sm bg-white cursor-pointer" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})}>
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
          </div>

          {/* BARIS 2: ASAL & LAHIR */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Asal Pimpinan / Kec / Kel
              </label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="Cth: PAC Cimuning" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Tempat, Tanggal Lahir
              </label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white" value={formData.birth_info} onChange={e => setFormData({...formData, birth_info: e.target.value})} placeholder="Cth: Bekasi, 12 Agustus 2004" />
            </div>
          </div>

          {/* BARIS 3: INTEGRASI BARU - LEVEL HIERARKI & PRIORITAS URUTAN */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Kasta / Level Struktural (Bagan Bertingkat)
              </label>
              <select 
                className="w-full p-3.5 border rounded-2xl text-sm bg-white cursor-pointer font-bold text-slate-700" 
                value={formData.position_level} 
                onChange={e => setFormData({...formData, position_level: Number(e.target.value)})}
              >
                <option value={1}>Level 1: Pimpinan Utama (Ketua / Ketum)</option>
                <option value={2}>Level 2: Jajaran BPH (Wakil Ketua, Sek, Ben)</option>
                <option value={3}>Level 3: Jajaran Departemen & Anggota</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Urutan Tampil (Order Priority)
              </label>
              <input 
                type="number" 
                className="w-full p-3.5 border rounded-2xl text-sm bg-white font-bold" 
                value={formData.order_priority} 
                onChange={e => setFormData({...formData, order_priority: Number(e.target.value)})}
                min={1}
                required
              />
            </div>
          </div>

          {/* BARIS 4: QUOTE & UPLOAD */}
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 tracking-widest"><Quote className="h-4 w-4" /> Quote</label>
              <textarea className="w-full p-4 border rounded-2xl text-sm bg-white h-[55px] resize-none" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} placeholder="Cth: Belajar, Berjuang, Bertaqwa." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Upload Desain Full Card</label>
              <input id="foto-kader" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full p-2.5 border rounded-2xl text-xs bg-white cursor-pointer" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={uploading} className={`${editingId ? 'bg-amber-600' : 'bg-primary'} text-white px-10 py-4 rounded-2xl text-sm font-black shadow-xl flex items-center gap-3 active:scale-95`}>
              {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : editingId ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? "PERBARUI CARD" : "SIMPAN CARD STRUKTURAL"}
            </button>
          </div>
        </form>

        {/* List Data Table */}
        <div className="rounded-[2rem] border border-border overflow-hidden bg-white shadow-xl mt-10">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="p-6 border-b">Card Desain</th>
                <th className="p-6 border-b text-center">Organisasi</th>
                <th className="p-6 border-b text-center">Tingkatan & Urutan</th>
                <th className="p-6 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cadres.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={c.image_url || "/placeholder.svg"} className="h-16 w-12 rounded-xl object-cover border bg-slate-100" />
                      <div>
                        <div className="font-black text-slate-900 uppercase text-base">{c.name}</div>
                        <div className="text-[10px] text-primary font-black uppercase tracking-widest">{c.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${c.organization === 'IPNU' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {c.organization}
                    </span>
                  </td>
                  {/* KOLOM INTEGRASI BARU: Menampilkan Level dan Urutan di Tabel */}
                  <td className="p-6 text-center font-bold text-slate-500">
                    <span className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      {c.position_level === 1 ? (
                        <span className="text-emerald-700 font-black">Ketum (Level 1)</span>
                      ) : c.position_level === 2 ? (
                        "BPH (Level 2)"
                      ) : (
                        "Anggota (Level 3)"
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Urutan Grid: {c.order_priority}</span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEditInitiation(c)} className="p-3 text-amber-600 hover:bg-amber-50 rounded-2xl border border-amber-100"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={async () => { if(window.confirm(`Hapus card ${c.name}?`)) { await supabase.from("cadres").delete().eq("id", c.id); fetchCadres(); }}} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl border border-red-100"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && lastCreatedCadre && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center space-y-6">
            <div>
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-primary uppercase">
                {isUpdateSuccess ? "Berhasil Diperbarui!" : "Desain Terpasang!"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isUpdateSuccess ? "Perubahan kartu desain kader sukses disimpan ke sistem." : "Kartu desain kader sukses masuk ke sistem web utama."}
              </p>
            </div>

            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img src={lastCreatedCadre.image_url || "/placeholder.svg"} className="w-full h-full object-cover" alt="Preview" />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex gap-4">
                <button onClick={() => setShowSuccessModal(false)} className="flex-1 py-4 rounded-[1.5rem] border-2 border-slate-100 font-black text-xs uppercase tracking-widest">Tutup</button>
                <button onClick={() => navigate('/struktural')} className="flex-1 py-4 rounded-[1.5rem] bg-emerald-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">Lihat Web</button>
              </div>
              <button onClick={() => navigate('/admin/dashboard')} className="w-full py-4 rounded-[1.5rem] bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                <LayoutDashboard className="h-4 w-4" /> DASHBOARD ADMIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};