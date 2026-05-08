import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Star, Trash2, MessageSquare, Send, Loader2, 
  MapPin, CheckCircle, ShieldCheck, Mail
} from "lucide-react";
import { toast } from "sonner";

export const RatingManager = () => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Ambil Ratings
      const ratingsRes = await supabase
        .from("service_ratings")
        .select("*")
        .order("created_at", { ascending: false });

      // Ambil Subscribers
      const subsRes = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (ratingsRes.error) throw ratingsRes.error;
      if (subsRes.error) throw subsRes.error;

      setRatings(ratingsRes.data || []);
      setSubscribers(subsRes.data || []);
    } catch (err: any) {
      toast.error("Gagal sinkron data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async (id: string) => {
    if (!feedbackText.trim()) return toast.error("Feedback balasan gak boleh kosong, Lan!");

    setSubmittingId(id);
    try {
      const { error } = await supabase
        .from("service_ratings")
        .update({ admin_feedback: feedbackText.trim() })
        .eq("id", id);

      if (error) throw error;

      toast.success("Feedback balasan sukses terkirim dan dipublish!");
      setFeedbackText("");
      fetchData();
    } catch (err: any) {
      toast.error("Gagal mengirim feedback: " + err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDeleteRating = async (id: string) => {
    if (!confirm("Hapus ulasan rating ini dari sistem secara permanen?")) return;

    try {
      const { error } = await supabase
        .from("service_ratings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Ulasan berhasil dihapus");
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menghapus data");
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (!confirm("Hapus email ini dari daftar langganan newsletter?")) return;

    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Email langganan dihapus");
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menghapus email");
    }
  };

  return (
    <AdminLayout title="Manajemen Rating & Langganan">
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-7xl mx-auto">
        
        {/* ================= MONITORING ULASAN PUBLIC ================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-brand font-black uppercase text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-5.5 w-5.5 text-primary" /> Pantau Rating Pelayanan ({ratings.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-6">
              {ratings.map((rate) => (
                <div key={rate.id} className="bg-white border rounded-[2rem] p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
                  
                  {/* Judul & Detail */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        rate.region_type === 'Bekasi' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {rate.region_type}
                      </span>
                      <h4 className="font-brand font-black text-base uppercase text-slate-900 mt-1">{rate.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" /> {rate.specific_region} — {rate.rated_service}
                      </p>
                    </div>

                    <div className="flex gap-1.5 items-center">
                      <div className="flex gap-0.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        {Array.from({ length: rate.rating_value }).map((_, i) => (
                          <Star key={i} className="h-3 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                      <button 
                        onClick={() => handleDeleteRating(rate.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 ml-2"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Isi Ulasan */}
                  <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                    "{rate.comment}"
                  </p>

                  {/* Status Balasan & Form Admin */}
                  <div className="pt-2">
                    {rate.admin_feedback ? (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-1.5">
                        <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> Balasan Anda Terpasang:
                        </span>
                        <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                          {rate.admin_feedback}
                        </p>
                        {/* Tombol ganti feedback */}
                        <button 
                          onClick={() => { setFeedbackText(rate.admin_feedback); }}
                          className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline pt-1.5 block"
                        >
                          Ubah Balasan
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-primary" /> Balas Ulasan Ini:
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Tulis balasan atau ucapan terimakasih resmi..."
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="flex-1 p-3 text-xs font-bold bg-slate-50 border rounded-2xl focus:bg-white outline-none focus:border-primary transition-all"
                          />
                          <button
                            onClick={() => handleSendFeedback(rate.id)}
                            disabled={submittingId === rate.id}
                            className="px-5 bg-primary text-white text-[10px] font-brand font-black uppercase tracking-widest rounded-2xl hover:opacity-95 flex items-center gap-1.5 shadow-md shadow-emerald-950/15"
                          >
                            {submittingId === rate.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Balas
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ))}
              {ratings.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed text-slate-400 font-bold uppercase text-xs">Belum ada ulasan masyarakat yang masuk.</div>
              )}
            </div>
          )}
        </div>

        {/* ================= MONITORING EMAIL NEWSLETTER ================= */}
        <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Mail className="h-5.5 w-5.5 text-primary" />
            <h3 className="font-brand font-black text-base uppercase text-slate-800">Daftar Langganan Email ({subscribers.length})</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              {subscribers.map((sub) => (
                <div key={sub.id} className="flex justify-between items-center p-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border transition-colors group">
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{sub.email}</span>
                  <button 
                    onClick={() => handleDeleteSub(sub.id)}
                    className="p-1.5 text-red-500 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                    title="Hapus Email"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {subscribers.length === 0 && (
                <div className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">Daftar langganan kosong.</div>
              )}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};