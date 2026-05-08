import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header"; // <-- IMPORT HEADER ASLI LU
import { Footer } from "@/components/Footer"; // <-- IMPORT FOOTER ASLI LU
import { 
  Phone, Mail, MapPin, Sparkles, 
  ArrowLeft, ArrowRight 
} from "lucide-react";

export const KontakKami = () => {
  const [activeRegion, setActiveRegion] = useState<string>("Bekasi Selatan");

  useEffect(() => {
    document.title = "Kontak Kami — PC IPNU IPPNU Kota Bekasi";
    window.scrollTo(0, 0);
  }, []);

  // Nomor WA Lu yang Baru & Link Direct untuk Tombol WhatsApp
  const myWhatsAppNumber = "62895330152658"; 
  const waUrl = `https://wa.me/${myWhatsAppNumber}?text=Halo%20Admin%20PC%20IPNU%20IPPNU%20Kota%20Bekasi%2C%20saya%20ingin%20bertanya%20mengenai...`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* 1. RENDER HEADER ASLI LU (PENTING!) */}
      <Header />

      {/* 2. RENDER MAIN CONTENT AREA */}
      <main className="flex-grow pb-20 relative overflow-hidden z-10">
        
        {/* SUNTIKAN STYLE ANIMASI MAINSTREAM & BACKGROUND BLOB DEKORATIF */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes blobFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          .animate-fade-up {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-blob {
            animation: blobFloat 8s ease-in-out infinite;
          }
        `}} />

        {/* BACKGROUND DEKORATIF GLOWING BLOB */}
        <div className="absolute top-1/3 left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none -z-10"></div>
        <div className="absolute top-2/3 right-[-10%] w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-blob pointer-events-none -z-10" style={{ animationDelay: '3s' }}></div>

        {/* HERO SECTION MARI BERSILATURAHMI */}
        <section className="relative py-24 bg-primary-deep text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.2),transparent_50%)]"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="container mx-auto px-5 lg:px-8 relative z-10 space-y-4">
            {/* Tombol Back */}
            <Link to="/" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors font-brand font-black text-xs uppercase tracking-wider mb-6 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Kembali
            </Link>
            
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gold/20 text-gold text-xs font-black uppercase tracking-widest rounded-full shadow-lg border border-gold/10">
              <Sparkles className="h-3.5 w-3.5 animate-bounce" /> Ada Pertanyaan? Mari Berdiskusi!
            </span>
            <h1 className="font-display font-black text-4xl lg:text-7xl uppercase tracking-tight italic transition-all hover:scale-[1.01]">
              Hubungi Kami
            </h1>
            <p className="text-sm lg:text-lg text-primary-foreground/85 max-w-2xl leading-relaxed font-semibold pt-1">
              Pintu silaturahmi, sinergi, dan kolaborasi kami terbuka lebar. Hubungi tim sekretariat atau mampir langsung ke kantor PC IPNU IPPNU Kota Bekasi.
            </p>
          </div>
        </section>

        {/* AREA KONTAK & MAPS SECTION */}
        <section className="container mx-auto px-5 lg:px-8 mt-20 max-w-7xl relative z-10 space-y-12">
          
          <div className="grid md:grid-cols-[1fr_420px] gap-10 lg:gap-16">
            
            {/* KOLOM KIRI: FORM / TEXT GREETING */}
            <div className="space-y-6">
              <h2 className="text-3xl font-brand font-black text-slate-800 uppercase tracking-tighter leading-none flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" /> Kami Siap Membantu Lu
              </h2>
              <div className="h-1 w-16 bg-gold rounded-full" />
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                Punya pertanyaan mengenai program kerja kaderisasi, silaturahmi ke struktural, atau butuh bantuan nulis artikel opini tentang pelajar NU Kota Bekasi? Tumpahkan aja apa yang ada di pikiran lu lewat saluran komunikasi kami di samping atau klik tombol WhatsApp pribadi asisten kami.
              </p>
            </div>

            {/* KOLOM KANAN: KARTU KONTAK & ALAMAT MEWAH */}
            <div className="space-y-6">
              
              {/* Kartu Telepon / WA */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-center gap-4 transition-all hover:shadow-2xl hover:-translate-y-1 transform animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="p-3.5 bg-gold/10 rounded-2xl text-gold shrink-0">
                  <Phone className="h-5 w-5 fill-gold text-gold animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-brand font-black text-xs uppercase tracking-widest text-slate-500">Telepon / WhatsApp</h4>
                  <a href="tel:62895330152658" className="text-xl font-brand font-black text-primary hover:underline transition-all">
                    0895330152658
                  </a>
                </div>
              </div>

              {/* Kartu Email */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-center gap-4 transition-all hover:shadow-2xl hover:-translate-y-1 transform animate-fade-up" style={{ animationDelay: '200ms' }}>
                <div className="p-3.5 bg-emerald-50 rounded-2xl text-primary shrink-0">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-brand font-black text-xs uppercase tracking-widest text-slate-500">Surel Resmi</h4>
                  <a href="mailto:lppipnuippnukotabekasi@gmail.com" className="text-sm font-black text-primary hover:underline transition-all truncate max-w-[280px]">
                    lppipnuippnukotabekasi@gmail.com
                  </a>
                </div>
              </div>

              {/* ======================================================== */}
              {/* KARTU ALAMAT MAPS MEWAH (SINKRON KE image_8.png STYLE) */}
              {/* ======================================================== */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-start gap-4 transition-all hover:shadow-2xl hover:-translate-y-1 transform animate-fade-up" style={{ animationDelay: '300ms' }}>
                <div className="p-3.5 bg-emerald-50 rounded-2xl text-primary shrink-0">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-brand font-black text-xl text-primary uppercase">Sekretariat</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    Jl. Veteran, RT.005/RW.003, Marga Jaya, Kec. Bekasi Sel., Kota Bks, Jawa Barat 17141
                  </p>
                  
                  {/* LINK BARU MAPS MEWAH (Anti-Eror Firebase) */}
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Jl.+Veteran,+RT.005/RW.003,+Marga+Jaya,+Kec.+Bekasi+Sel.,+Kota+Bks,+Jawa+Barat+17141" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-black text-primary uppercase tracking-wider hover:underline flex items-center gap-1.5 pt-1 group"
                  >
                    Buka di Google Maps <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </section>

      </main>

      {/* 3. RENDER FOOTER ASLI LU (PENTING!) */}
      <Footer />

    </div>
  );
};

export default KontakKami;