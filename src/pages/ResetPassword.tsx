import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Lock, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/integrations/firebase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Reset Password - IPNU IPPNU Bekasi";
    const code = new URLSearchParams(window.location.search).get("oobCode");
    if (!auth || !isFirebaseConfigured || !code) return;

    verifyPasswordResetCode(auth, code)
      .then(() => {
        setOobCode(code);
        setReady(true);
      })
      .catch(() => setReady(false));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    if (password !== confirm) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    if (!auth || !oobCode) {
      toast.error("Tautan reset password tidak valid");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("Password berhasil diubah!");
      navigate("/admin");
    } catch (error) {
      toast.error("Gagal mengubah password", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-background">
      <div className="w-full max-w-md">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" /> Kembali ke login
        </Link>
        <div className="mb-8"><Logo /></div>

        <span className="section-label">Atur Ulang Password</span>
        <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl">Password Baru</h1>
        <p className="mt-2 text-muted-foreground">Masukkan password baru untuk akun admin Anda.</p>

        {!ready ? (
          <div className="mt-8 p-6 rounded-sm border border-border bg-muted/30 text-center">
            <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Memverifikasi tautan reset... Pastikan Anda membuka halaman ini dari email reset password Firebase.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-brand font-bold uppercase tracking-wider mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-sm gradient-primary text-primary-foreground font-brand font-bold uppercase tracking-wider text-sm hover:opacity-95 transition-opacity shadow-elevated disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Password Baru
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
