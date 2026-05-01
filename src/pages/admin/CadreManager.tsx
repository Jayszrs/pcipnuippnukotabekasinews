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
  Image as ImageIcon,
  LayoutDashboard
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
    const { data, error } = await supabase
      .from("cadres")
      .select("*")
      .order("order_priority", { ascending: true });
    
    if (data) setCadres(data);
    setLoading(false);
  };

  useEffect(() => { fetchCadres(); }, []);

  // Fungsi Masuk Mode Edit
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

  // Reset Form ke keadaan awal
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

  // Proses Upload ke Supabase Storage
  const handleUpload = async () => {
    if (!imageFile) return currentImageUrl; // Jika tidak pilih foto baru saat edit, pakai yang lama

    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("cadres")
      .upload(filePath, imageFile);
    
    if (uploadError) { 
      toast.error("Gagal upload foto. Pastikan bucket 'cadres' tersedia & public."); 
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
    
    if (!url && imageFile) return; // Berhenti jika upload gagal

    const payload = { ...formData, image_url: url };
    
    if (editingId) {
      // PROSES UPDATE DATA
      const { error } = await supabase
        .from("cadres")
        .update(payload)
        .eq("id", editingId);
        
      if (!error) {
        toast.success("Data berhasil diperbarui!");
        resetForm();
        fetchCadres();
      } else {
        toast.error("Gagal memperbarui data.");
      }
    } else {
      // PROSES SIMPAN DATA BARU
      const { data, error } = await supabase
        .from("cadres")
        .insert([payload])
        .select();
      
      if (!error && data) {
        toast.success("Kader Berhasil Ditambahkan!");
        setLastCreatedCadre(data[0]); 
        setShowSuccessModal(true);    
        resetForm();
        fetchCadres();
      } else {
        toast.error("Gagal menambahkan data.");
      }
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-border shadow-sm overflow-hidden relative">
      {/* Header Panel */}
      <div className={`p-6 border-b border-border transition-colors ${editingId ? 'bg-amber-50' : 'bg-muted/5'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-display font-black text-primary flex items-center gap-2">
              {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />} 
              {editingId ? "Edit Struktural" : "Tambah Struktural"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {editingId ? `Mengubah data pengurus: ${formData.name}` : "Kelola data pengurus PC IPNU IPPNU Kota Bekasi."}
            </p>
          </div>
          {editingId && (
            <button 
              onClick={resetForm} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-all"
            >
              <XCircle className="h-4 w-4" /> BATAL EDIT
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Form Input Kader */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-3xl mb-10 space-y-5 border transition-all ${editingId ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
              <input 
                className="w-full p-3 border rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Cth: Jaelani Surya Saputra"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jabatan</label>
              <input 
                className="w-full p-3 border rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                value={formData.position} 
                onChange={e => setFormData({...formData, position: e.target.value})} 
                placeholder="Cth: Ketua Umum"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Divisi/Bidang</label>
              <input 
                className="w-full p-3 border rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                value={formData.division} 
                onChange={e => setFormData({...formData, division: e.target.value})} 
                placeholder="Cth: Badan Pengurus Harian"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Organisasi</label>
              <select 
                className="w-full p-3 border rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                value={formData.organization} 
                onChange={e => setFormData({...formData, organization: e.target.value})}
              >
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                <Quote className="h-3 w-3" /> Quote / Kata Mutiara
              </label>
              <textarea 
                className="w-full p-3 border rounded-2xl text-sm bg-white h-[50px] resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                value={formData.quote} 
                onChange={e => setFormData({...formData, quote: e.target.value})} 
                placeholder="Cth: Belajar, Berjuang, Bertaqwa."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> Foto {editingId && "(Kosongkan jika tetap)"}
              </label>
              <input 
                id="foto-kader" 
                type="file" 
                accept="image/*" 
                onChange={e => setImageFile(e.target.files?.[0] || null)} 
                className="w-full p-2 border rounded-2xl text-xs bg-white cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button 
              type="submit" 
              disabled={uploading} 
              className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary-deep'} text-white px-10 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50`}
            >
              {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "Perbarui Data" : "Simpan Kader"}
            </button>
          </div>
        </form>

        {/* Tabel List Kader */}
        <div className="rounded-3xl border border-border overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em]">
                  <th className="p-5 border-b">Profil Kader</th>
                  <th className="p-5 border-b">Jabatan & Divisi</th>
                  <th className="p-5 border-b text-center">Org</th>
                  <th className="p-5 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cadres.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-400 italic">Belum ada data kader.</td>
                  </tr>
                )}
                {cadres.map(c => (
                  <tr key={c.id} className={`hover:bg-slate-50/50 transition-colors ${editingId === c.id ? 'bg-amber-50/50' : ''}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-border shadow-sm shrink-0">
                          <img src={c.image_url || "/placeholder.svg"} className="h-full w-full object-cover object-top" alt={c.name} />
                        </div>
                        <div className="font-black text-slate-900 uppercase tracking-tight">{c.name}</div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-primary uppercase text-xs">{c.position}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.division}</div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.organization === 'IPNU' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {c.organization}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEditInitiation(c)} className="p-2.5 text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={async () => { 
                            if(window.confirm(`Hapus data ${c.name}?`)) { 
                              await supabase.from("cadres").delete().eq("id", c.id); 
                              fetchCadres(); 
                              toast.success("Kader berhasil dihapus"); 
                            } 
                          }} 
                          className="p-2.5 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL POPUP - PREMIUM PREVIEW */}
      {showSuccessModal && lastCreatedCadre && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 border border-white/20">
            <div className="text-center">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Kader Terdaftar!</h3>
              <p className="text-sm text-muted-foreground">Data telah berhasil masuk ke sistem struktural.</p>
            </div>

            {/* Premium Mini Preview Card */}
            <div className="aspect-[4/5] rounded-[2rem] bg-primary-deep overflow-hidden relative shadow-2xl border border-white/10 group isolate">
               {/* Background Pattern */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-black z-0 opacity-90"></div>
               <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-10 text-[8rem] font-black text-white">NU</div>
              
               <img src={lastCreatedCadre.image_url} className="absolute inset-0 w-full h-full object-cover object-top z-20 drop-shadow-lg" alt="Preview" />
               
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent z-30"></div>
               
               <div className="absolute bottom-6 left-6 right-6 text-white z-40">
                <p className="font-black uppercase text-xl leading-tight drop-shadow-md">{lastCreatedCadre.name}</p>
                <div className="h-1 w-10 bg-gold my-2 rounded-full"></div>
                <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">{lastCreatedCadre.position}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowSuccessModal(false)} 
                className="flex-1 py-4 rounded-2xl border border-border font-bold text-xs hover:bg-slate-50 transition-colors uppercase tracking-widest"
              >
                Tutup
              </button>
              <button 
                onClick={() => navigate('/struktural')} 
                className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary-deep transition-all shadow-lg shadow-primary/20 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="h-3 w-3" /> Lihat Web
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};