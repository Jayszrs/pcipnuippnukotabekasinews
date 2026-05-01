import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, Quote } from "lucide-react";
import { toast } from "sonner";

export const CadreManager = () => {
  const [cadres, setCadres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State - Ditambahkan field quote
  const [formData, setFormData] = useState({
    name: "", 
    position: "", 
    division: "", 
    organization: "IPNU", 
    period_start: "2025", 
    period_end: "2027",
    quote: "" // Field baru untuk Quote
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCadres = async () => {
    const { data } = await supabase.from("cadres").select("*").order("order_priority", { ascending: true });
    if (data) setCadres(data);
    setLoading(false);
  };

  useEffect(() => { fetchCadres(); }, []);

  const handleUpload = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("cadres").upload(filePath, imageFile);
    
    if (error) { toast.error("Gagal upload foto"); return null; }
    const { data } = supabase.storage.from("cadres").getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = await handleUpload();
    
    // Pastikan quote dikirim ke database
    const { error } = await supabase.from("cadres").insert([{ 
      ...formData, 
      image_url: url 
    }]);
    
    if (!error) {
      toast.success("Kader berhasil ditambahkan!");
      setFormData({ 
        ...formData, 
        name: "", 
        position: "", 
        division: "", 
        quote: "" 
      });
      setImageFile(null);
      
      // Reset input file secara manual
      const fileInput = document.getElementById('foto-kader') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchCadres();
    } else {
      toast.error("Gagal menambahkan data kader");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/10">
        <h2 className="text-xl font-display font-black text-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> Manajemen Struktural
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tambahkan pengurus PC IPNU IPPNU Kota Bekasi untuk ditampilkan di halaman Struktural.
        </p>
      </div>

      <div className="p-6">
        {/* Form Input Kader */}
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-xl mb-8 space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
              <input 
                placeholder="Cth: Jaelani Surya Saputra" 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jabatan</label>
              <input 
                placeholder="Cth: Ketua Umum" 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                value={formData.position} 
                onChange={e => setFormData({...formData, position: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Divisi / Bidang</label>
              <input 
                placeholder="Cth: Badan Pengurus Harian" 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                value={formData.division} 
                onChange={e => setFormData({...formData, division: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organisasi</label>
              <select 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                value={formData.organization} 
                onChange={e => setFormData({...formData, organization: e.target.value})}
              >
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Quote className="h-3 w-3" /> Quote / Kata Mutiara
              </label>
              <textarea 
                placeholder="Cth: Belajar, Berjuang, Bertaqwa." 
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-[42px]" 
                value={formData.quote} 
                onChange={e => setFormData({...formData, quote: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foto (Transparan disarankan)</label>
              <div className="flex gap-2">
                <input 
                  id="foto-kader"
                  type="file" 
                  accept="image/*" 
                  onChange={e => setImageFile(e.target.files?.[0] || null)} 
                  className="w-full p-2 border rounded-lg text-xs bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={uploading} 
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide hover:bg-primary-deep transition-all shadow-sm flex items-center gap-2"
            >
              {uploading ? <><Loader2 className="animate-spin h-4 w-4" /> Mengupload...</> : "Simpan Data Kader"}
            </button>
          </div>
        </form>

        {/* Tabel Data Kader */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-widest font-bold">
                  <th className="p-4 border-b">Profil</th>
                  <th className="p-4 border-b">Detail Jabatan</th>
                  <th className="p-4 border-b">Quote</th>
                  <th className="p-4 border-b text-center">Organisasi</th>
                  <th className="p-4 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                      Memuat data...
                    </td>
                  </tr>
                ) : cadres.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      Belum ada data struktural.
                    </td>
                  </tr>
                ) : (
                  cadres.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-border">
                            <img src={c.image_url || "/placeholder.svg"} className="h-full w-full object-cover object-top" alt={c.name} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{c.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{c.period_start} - {c.period_end}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-primary">{c.position}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{c.division}</div>
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <p className="text-xs text-slate-600 italic truncate" title={c.quote}>
                          {c.quote ? `"${c.quote}"` : "-"}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          c.organization === 'IPNU' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}>
                          {c.organization}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={async () => { 
                            if(window.confirm('Yakin ingin menghapus kader ini?')) {
                              await supabase.from("cadres").delete().eq("id", c.id); 
                              fetchCadres(); 
                              toast.success("Kader dihapus");
                            }
                          }} 
                          className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors inline-flex"
                          title="Hapus Kader"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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