import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Lupa Password — IPNU IPPNU Bekasi";
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Gagal mengirim email", { description: error.message });
      return;
    }
    setSent(true);
    toast.success("Email reset password terkirim");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-background">
      <div className="w-full max-w-md">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" /> Kembali ke login
        </Link>
        <div className="mb-8"><Logo /></div>

        <span className="section-label">Pemulihan Akun</span>
        <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl">Lupa Password?</h1>
        <p className="mt-2 text-muted-foreground">
          Masukkan email akun admin Anda. Kami akan mengirim tautan untuk mengatur ulang password.
        </p>

        {sent ? (
          <div className="mt-8 p-6 rounded-sm border border-border bg-muted/30 text-center">
            <KeyRound className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="font-display font-bold text-lg">Cek inbox Anda</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Email berisi tautan reset password telah dikirim ke <strong>{email}</strong>.
              Periksa folder spam jika tidak terlihat.
            </p>
          </div>
        ) : (
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

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-sm gradient-primary text-primary-foreground font-brand font-bold uppercase tracking-wider text-sm hover:opacity-95 transition-opacity shadow-elevated disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Kirim Tautan Reset
            </button>
          </form>
        )}

        <p className="mt-8 text-sm text-center text-muted-foreground">
          Ingat password Anda?{" "}
          <Link to="/admin" className="text-primary font-bold hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
