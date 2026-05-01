import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Quote, 
  Edit2, 
  XCircle, 
  Save,
  CheckCircle2,
  ArrowLeft,
  LayoutDashboard,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CadreManager = () => {
  const navigate = useNavigate();
  const [cadres, setCadres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // State untuk Fitur Edit & Modal Sukses
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedCadre, setLastCreatedCadre] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", 
    position: "", 
    division: "", 
    organization: "IPNU", 
    period_start: "2025", 
    period_end: "2027",
    quote: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const fetchCadres = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cadres")
      .select("*")
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
      quote: cadre.quote || ""
    });
    setCurrentImageUrl(cadre.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info(`Mode edit aktif: ${cadre.name}`);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", position: "", division: "", 
      organization: "IPNU", period_start: "2025", period_end: "2027", quote: ""
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
    const filePath = `cadre_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("cadres")
      .upload(filePath, imageFile);
    
    if (uploadError) { 
      toast.error("Gagal upload foto"); 
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
    
    if (!url && imageFile) return;

    const payload = { ...formData, image_url: url };
    
    if (editingId) {
      const { error } = await supabase.from("cadres").update(payload).eq("id", editingId);
      if (!error) {
        toast.success("Data berhasil diperbarui!");
        resetForm();
        fetchCadres();
      }
    } else {
      const { data, error } = await supabase.from("cadres").insert([payload]).select();
      if (!error && data) {
        toast.success("Kader Berhasil Diupload!");
        setLastCreatedCadre(data[0]); 
        setShowSuccessModal(true);    
        resetForm();
        fetchCadres();
      }
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-border shadow-sm overflow-hidden relative min-h-screen">
      {/* HEADER DENGAN TOMBOL KEMBALI */}
      <div className={`p-6 border-b border-border transition-colors ${editingId ? 'bg-amber-50' : 'bg-slate-50/50'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* INI TOMBOL KEMBALINYA LAN! */}
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="p-2.5 hover:bg-white rounded-xl text-primary transition-all shadow-sm border border-border group"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div>
              <h2 className="text-2xl font-display font-black text-primary uppercase tracking-tight">
                {editingId ? "Edit Struktural" : "Tambah Struktural"}
              </h2>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Pengelolaan Kader PC IPNU IPPNU Kota Bekasi
              </p>
            </div>
          </div>

          {editingId && (
            <button onClick={resetForm} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors shadow-sm">
              <XCircle className="h-4 w-4" /> BATAL EDIT
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* FORM INPUT */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-[2rem] mb-10 space-y-6 border transition-all ${editingId ? 'bg-amber-50/50 border-amber-200 shadow-inner' : 'bg-white border-slate-200 shadow-lg shadow-slate-100'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Cth: Jaelani Surya Saputra" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Jabatan</label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="Cth: Ketua Umum" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Divisi</label>
              <input className="w-full p-3.5 border rounded-2xl text-sm bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} placeholder="Cth: Badan Pengurus Harian" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Organisasi</label>
              <select className="w-full p-3.5 border rounded-2xl text-sm bg-white focus:ring-4 focus:ring-primary/5 outline-none cursor-pointer" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})}>
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                <Quote className="h-4 w-4" /> Quote Kader
              </label>
              <textarea className="w-full p-4 border rounded-2xl text-sm bg-white h-[55px] resize-none focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} placeholder="Cth: Belajar, Berjuang, Bertaqwa." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Foto (Format PNG/JPG)</label>
              <input id="foto-kader" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full p-2.5 border rounded-2xl text-xs bg-white cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={uploading} className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary-deep'} text-white px-10 py-4 rounded-2xl text-sm font-black shadow-xl shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50`}>
              {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : editingId ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? "PERBARUI DATA" : "SIMPAN STRUKTURAL"}
            </button>
          </div>
        </form>

        {/* TABEL LIST */}
        <div className="rounded-[2rem] border border-border overflow-hidden bg-white shadow-xl shadow-slate-100">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="p-6 border-b">Profil Pengurus</th>
                <th className="p-6 border-b text-center">Organisasi</th>
                <th className="p-6 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cadres.map(c => (
                <tr key={c.id} className={`hover:bg-slate-50/50 transition-colors ${editingId === c.id ? 'bg-amber-50/50' : ''}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={c.image_url || "/placeholder.svg"} className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100" alt={c.name} />
                      <div>
                        <div className="font-black text-slate-900 uppercase tracking-tight text-base">{c.name}</div>
                        <div className="text-[10px] text-primary font-black uppercase tracking-widest">{c.position} — {c.division}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${c.organization === 'IPNU' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {c.organization}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEditInitiation(c)} className="p-3 text-amber-600 hover:bg-amber-50 rounded-2xl transition-all shadow-sm border border-amber-100"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={async () => { if(window.confirm(`Hapus data ${c.name}?`)) { await supabase.from("cadres").delete().eq("id", c.id); fetchCadres(); toast.success("Dihapus"); }}} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-red-100"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUCCESS MODAL PREMIUM */}
      {showSuccessModal && lastCreatedCadre && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl space-y-8 border border-white/20 text-center">
            <div>
              <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">DATA MASUK!</h3>
              <p className="text-sm text-muted-foreground font-medium mt-2">Struktural baru berhasil didaftarkan ke sistem.</p>
            </div>

            <div className="aspect-[4/5] rounded-[2.5rem] bg-primary-deep overflow-hidden relative shadow-2xl border-4 border-white isolate">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-black opacity-80 z-0"></div>
              <img src={lastCreatedCadre.image_url} className="absolute inset-0 w-full h-full object-cover object-top z-10" alt="Preview" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent z-20"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white text-left z-30">
                <p className="font-black uppercase text-xl leading-tight drop-shadow-lg">{lastCreatedCadre.name}</p>
                <div className="h-1.5 w-10 bg-gold my-3 rounded-full"></div>
                <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">{lastCreatedCadre.position}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSuccessModal(false)} 
                  className="flex-1 py-4 rounded-[1.5rem] border-2 border-slate-100 font-black text-xs hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  Input Lagi
                </button>
                <button 
                  onClick={() => navigate('/struktural')} 
                  className="flex-1 py-4 rounded-[1.5rem] bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Globe className="h-4 w-4" /> Lihat Web
                </button>
              </div>
              
              <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="w-full py-4 rounded-[1.5rem] bg-primary text-white font-black text-xs hover:bg-primary-deep transition-all shadow-lg shadow-primary/20 uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <LayoutDashboard className="h-4 w-4" /> KEMBALI KE DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};