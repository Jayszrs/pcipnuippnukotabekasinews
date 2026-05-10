import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/firebase/supabaseCompat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Star, MapPin, Send, Loader2, Award, 
  MessageSquare, User, Sparkles, ArrowLeft, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export const RatingPelayanan = () => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [regionType, setRegionType] = useState<"Bekasi" | "Luar Bekasi">("Bekasi");
  const [specificRegion, setSpecificRegion] = useState("");
  const [ratedService, setRatedService] = useState("Pelayanan Pengurus Cabang");
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Rating Pelayanan — PC IPNU IPPNU Kota Bekasi";
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoadingList(true);
      const { data, error } = await supabase
        .from("service_ratings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRatings(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specificRegion.trim() || !comment.trim()) {
      return toast.error("Semua kolom isian wajib diisi ya!");
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("service_ratings")
        .insert([{
          name: name.trim(),
          region_type: regionType,
          specific_region: specificRegion.trim(),
          rated_service: ratedService,
          rating_value: ratingValue,
          comment: comment.trim()
        }]);

      if (error) throw error;

      toast.success("Mantaap! Ulasan pelayanan sukses dikirim ke admin 🌟");
      setName("");
      setSpecificRegion("");
      setComment("");
      setRatingValue(5);
      fetchRatings();
    } catch (err: any) {
      toast.error("Gagal mengirim ulasan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="container-news flex-grow py-12 bg-background">
        {/* Tombol Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-gold transition-colors font-brand font-black text-xs uppercase tracking-wider mb-10">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        {/* Heading Section */}
        <div className="text-center mb-16 space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold text-[10px] font-black uppercase tracking-widest rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Suara Pelajar & Masyarakat
          </span>
          <h1 className="text-3xl md:text-5xl font-brand font-black text-primary uppercase tracking-tighter leading-none">
            RATING & EVALUASI LAYANAN
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground uppercase font-brand font-black tracking-[0.25em]">
            Bantu kami berbenah demi pelayanan yang lebih inklusif dan progresif
          </p>
          <div className="h-1.5 w-20 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-[450px_1fr] gap-12 max-w-6xl mx-auto">
          
          {/* ================= FORM KANAN: ISI ULASAN ================= */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-100 h-fit space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-brand font-black text-primary uppercase">Kirim Ulasan Anda</h2>
              <p className="text-xs text-muted-foreground font-medium">Beri kami penilaian bintang dan deskripsi ulasan yang jujur.</p>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-5">
              {/* Nama */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"><User className="h-3.5 w-3.5 text-primary" /> Nama Lengkap</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Cth: Jaelani Surya"
                  className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>

              {/* Scope Wilayah */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cakupan Wilayah</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input type="radio" checked={regionType === "Bekasi"} onChange={() => setRegionType("Bekasi")} className="text-primary focus:ring-0" />
                    Warga Kota Bekasi
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input type="radio" checked={regionType === "Luar Bekasi"} onChange={() => setRegionType("Luar Bekasi")} className="text-primary focus:ring-0" />
                    Luar Kota Bekasi (Nasional)
                  </label>
                </div>
              </div>

              {/* Detail Wilayah */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> Daerah Asal / Kecamatan / Kota</label>
                <input 
                  type="text" required value={specificRegion} onChange={e => setSpecificRegion(e.target.value)}
                  placeholder={regionType === "Bekasi" ? "Cth: Mustika Jaya / PAC Cimuning" : "Cth: Bandung / PAC Dago"}
                  className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>

              {/* Layanan yang Dinilai */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aspek Pelayanan Yang Dinilai</label>
                <select 
                  value={ratedService} onChange={e => setRatedService(e.target.value)}
                  className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="Pelayanan Pengurus Cabang">Pelayanan Pengurus Cabang</option>
                  <option value="Kualitas Kegiatan / Event">Kualitas Kegiatan / Event</option>
                  <option value="Sistem Informasi & Website">Sistem Informasi & Website</option>
                  <option value="Kinerja Birokrasi Organisasi">Kinerja Birokrasi Organisasi</option>
                </select>
              </div>

              {/* Sistem Penilaian Bintang */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Rating Pelayanan</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingValue(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star 
                        className={`h-7 w-7 transition-all ${
                          star <= (hoveredStar ?? ratingValue) 
                            ? "fill-gold text-gold scale-110" 
                            : "text-slate-200"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Komentar */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5 text-primary" /> Isi Masukan / Kritik & Saran</label>
                <textarea 
                  required value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Tulis ulasan jujur kamu mengenai pelayanan kami..."
                  className="w-full p-3.5 bg-slate-50 border rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-primary transition-all h-28 resize-none"
                />
              </div>

              <button 
                type="submit" disabled={submitting}
                className="w-full py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-95 shadow-xl shadow-emerald-950/10 flex items-center justify-center gap-2 active:scale-98"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} KIRIM RATING LAYANAN
              </button>
            </form>
          </div>

          {/* ================= DAFTAR KIRI: HASIL FEEDBACK ================= */}
          <div className="space-y-6">
            <h2 className="text-xl font-brand font-black text-slate-800 uppercase flex items-center gap-2 border-b pb-3">
              <Award className="h-5.5 w-5.5 text-gold" /> Ulasan Masuk & Balasan Admin
            </h2>

            {loadingList ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-6 max-h-[750px] overflow-y-auto pr-2 no-scrollbar">
                {ratings.map((rate) => (
                  <div key={rate.id} className="bg-white border rounded-[2rem] p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                    
                    {/* Header Rater */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-brand font-black text-base uppercase text-slate-900">{rate.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-primary" /> {rate.specific_region} ({rate.region_type})
                        </p>
                      </div>
                      
                      {/* Bintang */}
                      <div className="flex gap-0.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        {Array.from({ length: rate.rating_value }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary/5 text-primary rounded-full">
                        {rate.rated_service}
                      </span>
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium pt-1">
                        "{rate.comment}"
                      </p>
                    </div>

                    {/* FEEDBACK BALASAN ADMIN (JIKA ADA) */}
                    {rate.admin_feedback ? (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2 relative overflow-hidden animate-in slide-in-from-bottom-2">
                        <div className="absolute top-0 right-0 h-1.5 w-12 bg-gold"></div>
                        <div className="flex items-center gap-2 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Balasan Resmi Admin:
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                          {rate.admin_feedback}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[9px] font-bold text-slate-400 uppercase italic">
                        ⌛ Menunggu verifikasi & balasan admin...
                      </div>
                    )}

                  </div>
                ))}

                {ratings.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed font-bold text-slate-400 uppercase text-xs">
                    Belum ada ulasan yang masuk. Jadilah yang pertama!
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

// Sub-komponen kecil ikon sukses
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
);
