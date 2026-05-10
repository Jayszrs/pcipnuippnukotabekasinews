import { useState, useEffect } from "react";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setFullname(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
    }
  }

  async function handleUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
    if (uploadError) return toast.error("Gagal upload");

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    
    setAvatarUrl(data.publicUrl);
    setLoading(false);
    toast.success("Foto berhasil diupdate!");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2" /> Kembali</Button>
      <h1 className="text-3xl font-bold">Edit Profil Admin</h1>
      
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="relative group">
          <img 
            src={avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`} 
            className="h-24 w-24 rounded-full object-cover border-4 border-primary/10" 
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Upload className="text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={loading} />
          </label>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email Anda</p>
          <p className="font-mono font-medium">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">Nama Lengkap</label>
          <Input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Nama Anda" />
        </div>
        <Button 
          className="w-full" 
          onClick={async () => {
            setLoading(true);
            await supabase.from("profiles").update({ full_name: fullname }).eq("id", user.id);
            setLoading(false);
            toast.success("Nama berhasil disimpan!");
          }}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Simpan Nama
        </Button>
      </div>
    </div>
  );
};

export default Profile;
