import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, Quote, Edit2, XCircle, Save } from "lucide-react";
import { toast } from "sonner";

export const CadreManager = () => {
  const [cadres, setCadres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // State untuk melacak mode EDIT
  const [editingId, setEditingId] = useState<string | null>(null);

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
    const { data } = await supabase.from("cadres").select("*").order("order_priority", { ascending: true });
    if (data) setCadres(data);
    setLoading(false);
  };

  useEffect(() => { fetchCadres(); }, []);

  // Fungsi untuk masuk ke mode EDIT
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
    
    // Scroll ke atas otomatis agar user sadar form sudah terisi
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info("Mode edit aktif: " + cadre.name);
  };

  // Bersihkan Form / Batal Edit
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

  // Proses Upload ke Storage
  const handleUpload = async () => {
    if (!imageFile) return currentImageUrl; // Jika tidak ada file baru, pakai URL yang sudah ada
    
    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("cadres").upload(filePath, imageFile);
    
    if (error) { 
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
    
    if (editingId) {
      // PROSES UPDATE
      const { error } = await supabase
        .from("cadres")
        .update({ ...formData, image_url: url })
        .eq("id", editingId);
        
      if (!error) {
        toast.success("Data kader berhasil diperbarui!");
        resetForm();
        fetchCadres();
      } else {
        toast.error("Gagal memperbarui data");
      }
    } else {
      // PROSES INSERT BARU
      const { error } = await supabase.from("cadres").insert([{ ...formData, image_url: url }]);
      if (!error) {
        toast.success("Kader berhasil ditambahkan!");
        resetForm();
        fetchCadres();
      } else {
        toast.error("Gagal menyimpan data");
      }
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header Panel */}
      <div className={`p-6 border-b border-border transition-colors ${editingId ? 'bg-amber-50' : 'bg-muted/10'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-display font-black text-primary flex items-center gap-2">
              {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />} 
              {editingId ? "Edit Data Struktural" : "Manajemen Struktural"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {editingId ? `Sedang mengubah data pengurus: ${formData.name}` : "Tambahkan jajaran pengurus PC IPNU IPPNU Kota Bekasi."}
            </p>
          </div>
          {editingId && (
            <button 
              onClick={resetForm} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors"
            >
              <XCircle className="h-4 w-4" /> BATAL EDIT
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Form Area */}
        <form onSubmit={handleSubmit} className={`p-5 rounded-xl mb-8 space-y-4 border transition-all ${editingId ? 'bg-amber-50/50 border-amber-200 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
              <input 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jabatan</label>
              <input 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none" 
                value={formData.position} 
                onChange={e => setFormData({...formData, position: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Divisi / Bidang</label>
              <input 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none" 
                value={formData.division} 
                onChange={e => setFormData({...formData, division: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organisasi</label>
              <select 
                className="w-full p-2.5 border rounded-lg text-sm bg-white" 
                value={formData.organization} 
                onChange={e => setFormData({...formData, organization: e.target.value})}
              >
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Quote className="h-3 w-3" /> Quote / Kata Mutiara
              </label>
              <textarea 
                placeholder="Cth: Belajar, Berjuang, Bertaqwa." 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none resize-none h-[42px]" 
                value={formData.quote} 
                onChange={e => setFormData({...formData, quote: e.target.value})} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Foto {editingId && "(Kosongkan jika tidak ganti)"}
              </label>
              <input 
                id="foto-kader"
                type="file" 
                accept="image/*" 
                onChange={e => setImageFile(e.target.files?.[0] || null)} 
                className="w-full p-2 border rounded-lg text-xs bg-white cursor-pointer" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end gap-3">
            <button 
              type="submit" 
              disabled={uploading} 
              className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary-deep'} text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2`}
            >
              {uploading ? (
                <><Loader2 className="animate-spin h-4 w-4" /> Memproses...</>
              ) : editingId ? (
                <><Save className="h-4 w-4" /> Perbarui Data</>
              ) : (
                <><Plus className="h-4 w-4" /> Simpan Data Kader</>
              )}
            </button>
          </div>
        </form>

        {/* List Data Area */}
        <div className="rounded-xl border border-border overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                  <th className="p-4 border-b">Profil</th>
                  <th className="p-4 border-b">Detail Jabatan</th>
                  <th className="p-4 border-b text-center">Organisasi</th>
                  <th className="p-4 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </td>
                  </tr>
                ) : cadres.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">Belum ada data struktural.</td>
                  </tr>
                ) : (
                  cadres.map(c => (
                    <tr key={c.id} className={`hover:bg-slate-50 transition-colors ${editingId === c.id ? 'bg-amber-50/50' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={c.image_url || "/placeholder.svg"} className="h-10 w-10 rounded-lg object-cover border bg-slate-100" alt={c.name} />
                          <div className="font-bold text-slate-900">{c.name}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-primary">{c.position}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{c.division}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          c.organization === 'IPNU' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {c.organization}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleEditInitiation(c)} 
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-all"
                            title="Edit Kader"
                          >
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
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                            title="Hapus Kader"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};