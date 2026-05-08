import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header"; 
import { Footer } from "@/components/Footer"; 
import { 
  Phone, Mail, MapPin, Sparkles, 
  ArrowLeft, ArrowRight 
} from "lucide-react";

export const KontakKami = () => {
  useEffect(() => {
    document.title = "Kontak Kami — PC IPNU IPPNU Kota Bekasi";
    window.scrollTo(0, 0);
  }, []);

  // Tautan Navigasi Universal Google Maps Resmi (Akurat & Langsung membuka Aplikasi Maps di HP/Laptop)
  const mapsNavigationUrl = "https://www.google.com/maps/search/?api=1&query=PC+IPNU+Kota+Bekasi+Jl.+Veteran+RT.005%2FRW.003+Marga+Jaya+Kec.+Bekasi+Sel.+Kota+Bks+Jawa+Barat+17141";

  // Nomor WA Lu & Tautan Direct Chat WhatsApp Fungsional
  const myWhatsAppNumber = "62895330152658"; 
  const waUrl = `https://wa.me/${myWhatsAppNumber}?text=Assalamualaikum%20Rekan%20Admin%20PC%20IPNU%20IPPNU%20Kota%20Bekasi%2C%20saya%20ingin%20bertanya%20mengenai...`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* 1. RENDER HEADER ASLI */}
      <Header />

      {/* 2. AREA KONTEN UTAMA */}
      <main className="flex-grow pb-20 relative overflow-hidden z-10">
        
        {/* STYLE ANIMASI & MOTION EFFECT */}
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

        {/* BACKGROUND DEKORATIF */}
        <div className="absolute top-1/3 left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none -z-10"></div>
        <div className="absolute top-2/3 right-[-10%] w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-blob pointer-events-none -z-10" style={{ animationDelay: '3s' }}></div>

        {/* HERO SECTION */}
        <section className="relative py-24 bg-primary-deep text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.2),transparent_50%)]"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="container mx-auto px-5 lg:px-8 relative z-10 space-y-4">
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

        {/* HUBUNGI KAMI & MAPS */}
        <section className="container mx-auto px-5 lg:px-8 mt-20 max-w-7xl relative z-10 space-y-12">
          
          <div className="grid md:grid-cols-[1fr_420px] gap-10 lg:gap-16">
            
            {/* KOLOM KIRI: TEKS & PETA INTERAKTIF REDIRECT */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-brand font-black text-slate-800 uppercase tracking-tighter leading-none flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" /> Kami Siap Membantu Lu
                </h2>
                <div className="h-1 w-16 bg-gold rounded-full" />
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  Punya pertanyaan mengenai program kerja kaderisasi, silaturahmi ke struktural, atau butuh bantuan nulis artikel opini tentang pelajar NU Kota Bekasi? Tumpahkan aja apa yang ada di pikiran lu lewat saluran komunikasi kami di samping atau klik tombol WhatsApp pribadi asisten kami.
                </p>
              </div>

              {/* ======================================================== */}
              {/* INTERACTIVE MAP CONTAINER (DIKLIK LANGSUNG KE GOOGLE MAPS) */}
              {/* ======================================================== */}
              <a 
                href={mapsNavigationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full aspect-[16/9] rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-xl relative group animate-fade-up cursor-pointer"
                title="Klik untuk membuka navigasi di Google Maps"
              >
                {/* Visual Iframe Peta Statis Terkunci Koordinat */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1738779951113!2d106.99507727448839!3d-6.244569061147571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cd8d4cc6c0bb27%3A0x7e0b3f167f9b5a9f!2sPC%20IPNU%20Kota%20Bekasi!5e0!3m2!1sid!2sid!4v1715112111111!5m2!1sid!2sid" 
                  className="w-full h-full border-none pointer-events-none"
                  loading="lazy" 
                  title="Peta Lokasi PC IPNU IPPNU Kota Bekasi"
                ></iframe>
                
                {/* Overlay Keren Pemanggil Perhatian (Call-to-Action) */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <span className="px-5 py-3 bg-[#03441b] text-white font-brand font-black text-[10px] uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-1.5">
                    Buka Rute Navigasi <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            </div>

            {/* KOLOM KANAN: KARTU KONTAK */}
            <div className="space-y-6">
              
              {/* KARTU TELEPON / WHATSAPP (SINKRON KE WA LU & AKSI DIRECT CHAT) */}
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-center gap-4 transition-all hover:shadow-2xl hover:-translate-y-1 transform animate-fade-up block group" 
                style={{ animationDelay: '100ms' }}
              >
                <div className="p-3.5 bg-gold/10 rounded-2xl text-gold shrink-0 group-hover:bg-[#25D366]/10 group-hover:text-[#25D366] transition-colors">
                  <Phone className="h-5 w-5 fill-current text-current animate-pulse" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-brand font-black text-xs uppercase tracking-widest text-slate-500">Hubungi WhatsApp Resmi</h4>
                  <div className="text-xl font-brand font-black text-primary group-hover:text-[#25D366] transition-colors">
                    0895330152658
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block">Klik untuk langsung chat otomatis 💬</span>
                </div>
              </a>

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

              {/* KARTU ALAMAT MAPS (DIKLIK LANGSUNG REDIRECT KE GOOGLE MAPS) */}
              <a 
                href={mapsNavigationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-start gap-4 transition-all hover:shadow-2xl hover:-translate-y-1 transform animate-fade-up block group text-left" 
                style={{ animationDelay: '300ms' }}
              >
                <div className="p-3.5 bg-emerald-50 rounded-2xl text-primary shrink-0 group-hover:bg-[#03441b]/10 group-hover:text-[#03441b] transition-colors">
                  <MapPin className="h-5 w-5 text-emerald-600 group-hover:text-[#03441b] transition-colors" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-brand font-black text-xl text-primary uppercase">Sekretariat</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    Gedung PCNU Kota Bekasi, Jl. Veteran, RT.005/RW.003, Marga Jaya, Kec. Bekasi Sel., Kota Bks, Jawa Barat 17141
                  </p>
                  <span className="text-xs font-brand font-black text-primary uppercase tracking-wider group-hover:underline flex items-center gap-1.5 pt-1">
                    Buka di Google Maps <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>

            </div>
          </div>

        </section>

      </main>

      {/* 3. RENDER FOOTER ASLI */}
      <Footer />

    </div>
  );
};

export default KontakKami;