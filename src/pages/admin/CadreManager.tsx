import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const CadreManager = () => {
  const [cadres, setCadres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "", position: "", division: "", 
    organization: "IPNU", period_start: "2025", period_end: "2027"
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
    const { error } = await supabase.from("cadres").insert([{ ...formData, image_url: url }]);
    
    if (!error) {
      toast.success("Kader berhasil ditambahkan!");
      setFormData({ ...formData, name: "" });
      setImageFile(null);
      fetchCadres();
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-sm border border-border shadow-sm">
      <h2 className="text-xl font-bold text-primary flex items-center gap-2">
        <Plus className="h-5 w-5" /> Tambah Struktural PC IPNU IPPNU
      </h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-sm">
        <input placeholder="Nama Lengkap" className="p-2 border rounded-sm text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Jabatan (ex: Ketua Umum)" className="p-2 border rounded-sm text-sm" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
        <select className="p-2 border rounded-sm text-sm" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})}>
          <option value="IPNU">IPNU</option>
          <option value="IPPNU">IPPNU</option>
        </select>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="text-xs" />
        <button type="submit" disabled={uploading} className="bg-primary text-white p-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
          {uploading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : "Simpan Kader"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white uppercase text-[10px] tracking-tighter">
              <th className="p-3">Foto</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Jabatan</th>
              <th className="p-3">Organisasi</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cadres.map(c => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="p-3"><img src={c.image_url} className="h-10 w-10 object-cover rounded-full" /></td>
                <td className="p-3 font-bold">{c.name}</td>
                <td className="p-3">{c.position}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.organization === 'IPNU' ? 'bg-primary/20 text-primary' : 'bg-blue-100 text-blue-700'}`}>{c.organization}</span></td>
                <td className="p-3">
                  <button onClick={async () => { await supabase.from("cadres").delete().eq("id", c.id); fetchCadres(); }} className="text-destructive hover:scale-110 transition-transform"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};