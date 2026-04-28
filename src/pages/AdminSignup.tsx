import { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Lock, Mail, User, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().trim().email("Email tidak valid").max(255),
  password: z.string().min(8, "Password minimal 8 karakter").max(72),
});

const AdminSignup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Daftar Admin — IPNU IPPNU Bekasi";
  }, []);

  if (user && (role === "admin" || role === "editor")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      toast.error("Periksa data Anda", {
        description: parsed.error.issues[0].message,
      });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setLoading(false);
      if (error.toLowerCase().includes("already")) {
        toast.error("Email sudah terdaftar", { description: "Silakan login." });
      } else {
        toast.error("Pendaftaran gagal", { description: error });
      }
      return;
    }
    // Auto login (auto-confirm enabled)
    const signInRes = await signIn(email, password);
    setLoading(false);
    if (signInRes.error) {
      toast.success("Akun dibuat! Silakan login.");
      navigate("/admin");
      return;
    }
    toast.success("Selamat datang!", { description: "Akun admin berhasil dibuat." });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative gradient-primary text-primary-foreground p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative"><Logo variant="light" /></div>
        <div className="relative">
          <Sparkles className="h-12 w-12 text-gold mb-5" />
          <h2 className="font-display font-black text-4xl leading-tight text-balance">
            Bergabung sebagai Tim Redaksi
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Daftar untuk mulai mempublikasikan berita, dokumentasi acara, dan opini pelajar NU Kota Bekasi.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-primary-foreground/85">
            <li>✓ Publikasi berita tanpa batas</li>
            <li>✓ Upload foto & video dokumentasi</li>
            <li>✓ Kelola arsip & kategori</li>
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© 2026 PC IPNU IPPNU Kota Bekasi</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Kembali ke login
          </Link>
          <div className="lg:hidden mb-8"><Logo /></div>

          <span className="section-label">Pendaftaran</span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl">Buat Akun Admin</h1>
          <p className="mt-2 text-muted-foreground">
            Pengguna pertama otomatis menjadi <span className="font-bold text-primary">Admin</span>.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmad Fauzi"
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@anda.com"
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">Minimal 8 karakter. Hindari password yang umum.</p>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-sm gradient-primary text-primary-foreground font-brand font-bold uppercase tracking-wider text-sm hover:opacity-95 transition-opacity shadow-elevated disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Daftar & Masuk Dashboard
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/admin" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
