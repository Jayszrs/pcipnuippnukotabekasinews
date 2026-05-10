import { useState } from "react";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email wajib diisi, Lan!");

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === "23505") { // Unique constraint error code
          toast.warning("Email ini udah terdaftar berlangganan kok, Lan! 👍");
        } else {
          throw error;
        }
      } else {
        toast.success("Mantaap! Email lu sukses terdaftar langganan berita harian 🚀");
        setEmail("");
      }
    } catch (err: any) {
      toast.error("Gagal berlangganan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03441b] to-[#022c12] text-primary-foreground p-8 shadow-2xl border border-emerald-800/30 group">
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gold/15 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gold/20 rounded-2xl text-gold shadow-lg border border-gold/10">
          <Bell className="h-6 w-6 animate-bounce" />
        </div>
        <h3 className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight text-white">
          Notifikasi Berita
        </h3>
      </div>
      
      <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-medium">
        Dapatkan berita terbaru IPNU IPPNU Kota Bekasi langsung ke email Anda.
      </p>

      <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@kamu.com" 
          className="px-4 py-3.5 rounded-2xl text-xs bg-white/95 text-slate-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold font-bold border-none transition-all shadow-inner" 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-3.5 rounded-2xl bg-gold hover:bg-amber-400 text-gold-foreground font-brand font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-amber-400/10 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "BERLANGGANAN"}
        </button>
      </form>
    </div>
  );
};
