import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plus, Trash2, Edit2, Loader2, Save, X, 
  Upload, Sparkles, Users, UserCheck 
} from "lucide-react";
import { toast } from "sonner";

interface Cadre {
  id: string;
  name: string;
  position: string;
  org_type: "IPNU" | "IPPNU";
  position_level: number; // 1: Ketua, 2: BPH, 3: Departemen
  sort_order: number;
  image_url: string | null;
}

export const CadreManager = () => {
  const { user } = useAuth();
  const [cadres, setCadres] = useState<Cadre[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form States
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [orgType, setOrgType] = useState<"IPNU" | "IPPNU">("IPNU");
  const [positionLevel, setPositionLevel] = useState<number>(2); // Default BPH
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Filter View State
  const [currentFilter, setCurrentFilter] = useState<"ALL" | "IPNU" | "IPPNU">("ALL");

  useEffect(() => {
    fetchCadres();
  }, []);

  const fetchCadres = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadres")
        .select("*")
        .order("position_level", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCadres(data || []);
    } catch (err) {
      toast.error("Gagal memuat data pengurus");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const path = `${user.id}/cadres/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload ke bucket news-media yang sudah ada permissions-nya
      const { error: uploadError } = await supabase.storage
        .from("news-media")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("news-media").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Foto berhasil diunggah!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPosition("");
    setOrgType("IPNU");
    setPositionLevel(2);
    setSortOrder(1);
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) {
      return toast.error("Semua field wajib diisi!");
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      position: position.trim(),
      org_type: orgType,
      position_level: Number(positionLevel),
      sort_order: Number(sortOrder),
      image_url: imageUrl,
    };

    try {
      if (editId) {
        // Mode Update
        const { error } = await supabase
          .from("cadres")
          .update(payload)
          .eq("id", editId);

        if (error) throw error;
        toast.success("Data pengurus berhasil diperbarui!");
      } else {
        // Mode Insert
        const { error } = await supabase
          .from("cadres")
          .insert([payload]);

        if (error) throw error;
        toast.success("Pengurus baru berhasil ditambahkan!");
      }
      resetForm();
      fetchCadres();
    } catch (err) {
      toast.error("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cadre: Cadre) => {
    setEditId(cadre.id);
    setName(cadre.name);
    setPosition(cadre.position);
    setOrgType(cadre.org_type);
    setPositionLevel(cadre.position_level);
    setSortOrder(cadre.sort_order);
    setImageUrl(cadre.image_url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pengurus ini dari jajaran struktural?")) return;

    try {
      const { error } = await supabase
        .from("cadres")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Data pengurus dihapus");
      fetchCadres();
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  };

  const displayedCadres = currentFilter === "ALL" 
    ? cadres 
    : cadres.filter(c => c.org_type === currentFilter);

  return (
    <AdminLayout title="Manajemen Struktural PC">
      <div className="grid lg:grid-cols-[400px_1fr] gap-8 max-w-7xl mx-auto">
        
        {/* FORM SUBMISSION UNTUK KEDUA ORGANISASI (SATU PANEL) */}
        <div className="bg-white p-6 rounded-sm border shadow-sm h-fit">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 mb-5">
            <Sparkles className="h-4 w-4 text-gold animate-pulse" /> 
            {editId ? "Edit Pengurus" : "Tambah Pengurus Baru"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Lengkap *</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Yusup Kurniawan"
                className="w-full p-2.5 text-xs font-bold border rounded-sm outline-none focus:border-primary"
              />
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jabatan Resmi *</label>
              <input 
                type="text" 
                value={position} 
                onChange={e => setPosition(e.target.value)}
                placeholder="Contoh: Ketua PC IPNU"
                className="w-full p-2.5 text-xs font-bold border rounded-sm outline-none focus:border-primary"
              />
            </div>

            {/* Organisasi Pilihan */}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Organisasi</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="radio" checked={orgType === "IPNU"} onChange={() => setOrgType("IPNU")} className="text-primary focus:ring-0" />
                  IPNU (Putera)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="radio" checked={orgType === "IPPNU"} onChange={() => setOrgType("IPPNU")} className="text-primary focus:ring-0" />
                  IPPNU (Putri)
                </label>
              </div>
            </div>

            {/* Level Hierarki (Alur Bertingkat) */}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Kasta / Level Struktural</label>
              <select 
                value={positionLevel} 
                onChange={e => setPositionLevel(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold border rounded-sm outline-none bg-slate-50"
              >
                <option value={1}>Level 1: Pimpinan Utama (Ketua / Ketum)</option>
                <option value={2}>Level 2: Jajaran BPH (Wakil Ketua, Sek, Ben)</option>
                <option value={3}>Level 3: Jajaran Departemen & Anggota</option>
              </select>
            </div>

            {/* Urutan Pengurutan */}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Urutan Tampil (Urutan Grid)</label>
              <input 
                type="number" 
                value={sortOrder} 
                onChange={e => setSortOrder(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold border rounded-sm outline-none"
                min={1}
              />
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Foto Struktural (Rasio 3:4 Direkomendasikan)</label>
              {imageUrl && (
                <div className="aspect-[3/4] w-24 rounded-lg overflow-hidden border mb-3 relative group">
                  <img src={imageUrl} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageUrl(null)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full"><X className="h-3 w-3" /></button>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 hover:border-primary rounded-sm cursor-pointer hover:bg-slate-50">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-slate-400" />}
                <span className="text-[10px] font-black uppercase tracking-wider">Pilih Foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                disabled={saving || uploading}
                className="flex-1 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center justify-center gap-1.5"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-sm text-[10px] font-black uppercase">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABEL VIEW MONITORING KADER */}
        <div className="space-y-4">
          
          {/* Filter Atas */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex gap-2">
              <button onClick={() => setCurrentFilter("ALL")} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${currentFilter === "ALL" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>Semua</button>
              <button onClick={() => setCurrentFilter("IPNU")} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${currentFilter === "IPNU" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>IPNU</button>
              <button onClick={() => setCurrentFilter("IPPNU")} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${currentFilter === "IPPNU" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>IPPNU</button>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{displayedCadres.length} Total Pengurus</span>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-sm border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    <th className="p-4">Foto</th>
                    <th className="p-4">Nama / Jabatan</th>
                    <th className="p-4 text-center">Organisasi</th>
                    <th className="p-4 text-center">Level Hierarki</th>
                    <th className="p-4 text-center">Urutan</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {displayedCadres.map((cadre) => (
                    <tr key={cadre.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="h-12 w-9 rounded overflow-hidden bg-slate-100 border">
                          {cadre.image_url ? (
                            <img src={cadre.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><Users className="h-4 w-4" /></div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm">{cadre.name}</div>
                        <div className="text-[10px] font-bold text-primary mt-0.5">{cadre.position}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          cadre.org_type === 'IPNU' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {cadre.org_type}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-500">
                        {cadre.position_level === 1 ? (
                          <span className="text-emerald-700 font-extrabold flex items-center justify-center gap-1"><UserCheck className="h-3.5 w-3.5" /> Ketua (Lvl 1)</span>
                        ) : cadre.position_level === 2 ? (
                          "BPH (Lvl 2)"
                        ) : (
                          "Departemen (Lvl 3)"
                        )}
                      </td>
                      <td className="p-4 text-center font-black text-slate-600">{cadre.sort_order}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleEdit(cadre)} className="p-2 hover:bg-slate-100 rounded text-amber-600"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => handleDelete(cadre.id)} className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedCadres.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">Belum ada data kepengurusan terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};