import { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Lock, Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login — IPNU IPPNU Bekasi";
  }, []);

  if (user && (role === "admin" || role === "editor")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    setEmail(cleanEmail);
    const { error } = await signIn(cleanEmail, password);
    setLoading(false);
    if (error) {
      toast.error("Login gagal", { description: error });
      return;
    }
    toast.success("Selamat datang kembali!");
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative gradient-primary text-primary-foreground p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative"><Logo variant="light" /></div>
        <div className="relative">
          <ShieldCheck className="h-12 w-12 text-gold mb-5" />
          <h2 className="font-display font-black text-4xl leading-tight text-balance">
            Dashboard Redaksi IPNU IPPNU Kota Bekasi
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Kelola berita, dokumentasi acara, dan publikasi opini pelajar Nahdlatul Ulama.
          </p>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© 2026 PC IPNU IPPNU Kota Bekasi</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </Link>
          <div className="lg:hidden mb-8"><Logo /></div>

          <span className="section-label">Area Terbatas</span>
          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl">Login Admin</h1>
          <p className="mt-2 text-muted-foreground">Masuk untuk mengelola berita & konten portal.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ipnuippnubekasi.or.id"
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div className="mt-2 text-right">
                <Link to="/admin/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                  Lupa password?
                </Link>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-sm gradient-primary text-primary-foreground font-brand font-bold uppercase tracking-wider text-sm hover:opacity-95 transition-opacity shadow-elevated disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Masuk ke Dashboard
            </button>
          </form>

          <p className="mt-8 text-xs text-center text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/admin/signup" className="text-primary font-bold hover:underline">
              Buat akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
