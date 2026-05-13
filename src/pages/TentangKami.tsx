import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Award, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Flag, 
  Heart,
  ArrowRight
} from "lucide-react";
import { Header } from "@/components/Header"; // <-- IMPORT HEADER ASLI LU
import { Footer } from "@/components/Footer"; // <-- IMPORT FOOTER ASLI LU
import tentangHeroBg from "@/assets/hero-news.jpg";
import historyParallaxBg from "@/assets/news-12.jpg";

// DATA SEJARAH YANG SUDAH DIPERKAYA & DISTRUKTURKAN
const IPNU_HISTORY = [
  {
    year: "1954",
    title: "Lahirnya Sang Ikatan",
    date: "24 Februari 1954 (20 Jumadil Akhir 1373 H)",
    location: "Semarang, Jawa Tengah",
    summary: "Dideklarasikan pada Kongres LP Ma'arif NU sebagai wadah perjuangan kaum pelajar laki-laki.",
    details: "Dipelopori oleh tokoh-tokoh muda hebat seperti Prof. Dr. KH. Tolchah Mansyur, Sofwan Kholil, dan Mustahal Ahmad. Pendirian ini berawal dari kegelisahan pentingnya mengorganisir santri dan pelajar agar memiliki benteng ideologi Ahlussunnah wal Jama'ah sejak dini.",
    badge: "Kelahiran",
    icon: Flag
  },
  {
    year: "1966",
    title: "Menjadi Badan Otonom Mandiri",
    date: "Kongres Surabaya 1966",
    location: "Surabaya, Jawa Timur",
    summary: "Resmi melepaskan diri dari LP Ma'arif untuk bergerak lebih lincah dan mandiri.",
    details: "Sebelumnya, IPNU berada di bawah koordinasi Lembaga Pendidikan Ma'arif NU. Seiring pesatnya perkembangan organisasi, Kongres Surabaya memutuskan IPNU berdiri tegak sebagai Badan Otonom (Banom) NU langsung agar bisa memperluas jaringan ke sekolah-sekolah umum, pesantren, hingga perguruan tinggi.",
    badge: "Kemandirian",
    icon: Award
  },
  {
    year: "1988",
    title: "Represi Orde Baru & Deklarasi Jombang",
    date: "29-31 Januari 1988",
    location: "Jombang, Jawa Timur",
    summary: "Berubah nama menjadi 'Ikatan Putera Nahdlatul Ulama' demi menyiasati UU Keormasan Orba.",
    details: "Regulasi ketat dari rezim Orde Baru lewat UU No. 8/1985 melarang keras adanya organisasi pelajar selain OSIS di sekolah. Melalui Kongres ke-10 di Jombang, nama 'Pelajar' terpaksa diubah menjadi 'Putera' agar organisasi ini tetap legal dan kaderisasi di akar rumput tidak mati dibungkam negara.",
    badge: "Siasat Politik",
    icon: Calendar
  },
  {
    year: "2003",
    title: "Kembalinya Khittah Pelajar",
    date: "18-22 Juni 2003",
    location: "Surabaya, Jawa Timur",
    summary: "Mengembalikan nama 'Pelajar' pasca runtuhnya rezim totaliter Orde Baru.",
    details: "Setelah gerbang reformasi dan kebebasan berserikat terbuka lebar, Kongres ke-14 IPNU di Surabaya secara bulat memutuskan mengembalikan nama luhur organisasi menjadi 'Ikatan Pelajar Nahdlatul Ulama'. Fokus kaderisasi dikembalikan seutuhnya untuk menggarap potensi intelektual pelajar, santri, dan mahasiswa.",
    badge: "Khittah",
    icon: Sparkles
  }
];

const IPPNU_HISTORY = [
  {
    year: "1955",
    title: "Fajar Baru Pelajar Putri",
    date: "2 Maret 1955 (8 Rajab 1374 H)",
    location: "Solo, Jawa Tengah",
    summary: "Didirikan oleh para santriwati tangguh demi menjembatani perjuangan pelajar putri NU.",
    details: "Dipelopori oleh Nyai Hj. Umroh Mahfudzah, Syarifah Syahrazad, dan rekan-rekanwati Solo lainnya. Kelahiran IPPNU disetujui secara resmi dalam muktamar untuk mengimbangi gerakan IPNU dan memberi ruang aktualisasi sosial keagamaan bagi perempuan muda NU.",
    badge: "Kelahiran",
    icon: Heart
  },
  {
    year: "1966",
    title: "Berdiri Tegak Sebagai Banom",
    date: "Kongres Surabaya 1966",
    location: "Surabaya, Jawa Timur",
    summary: "IPPNU resmi diakui sebagai Badan Otonom mandiri setara dengan banom lainnya.",
    details: "Sama halnya dengan IPNU, IPPNU melepas ketergantungannya dari struktural LP Ma'arif dan menjelma menjadi banom mandiri. Hal ini memicu gelombang emansipasi besar-besaran bagi kader perempuan NU di seluruh penjuru nusantara untuk memimpin organisasinya sendiri.",
    badge: "Kemandirian",
    icon: Award
  },
  {
    year: "1988",
    title: "Era Penyesuaian 'Putri-Putri'",
    date: "Kongres Jombang IX (1988)",
    location: "Jombang, Jawa Timur",
    summary: "Penyesuaian nama menjadi 'Ikatan Putri-Putri Nahdlatul Ulama' akibat regulasi Orba.",
    details: "Guna menghindari pembubaran paksa oleh undang-undang kepemudaan rezim Orde Baru, IPPNU mengubah kepanjangannya menjadi 'Ikatan Putri-Putri Nahdlatul Ulama'. Fase ini menjadi saksi ketangguhan kaderwati dalam menjaga api perjuangan Aswaja di tengah tekanan militeristik politik.",
    badge: "Ketahanan",
    icon: Calendar
  },
  {
    year: "2003",
    title: "Kembalinya Marwah Pelajar Putri",
    date: "18-22 Juni 2003",
    location: "Surabaya, Jawa Timur",
    summary: "Nama agung 'Pelajar Putri' resmi direbut kembali pada era reformasi.",
    details: "Melalui Kongres ke-13 di Surabaya, IPPNU mengembalikan jati dirinya secara utuh menjadi 'Ikatan Pelajar Putri Nahdlatul Ulama'. Komitmen perjuangan difokuskan kembali pada pemberdayaan literasi, kepemimpinan perempuan muda, serta dakwah moderat di kalangan pelajar sekolah.",
    badge: "Khittah",
    icon: Sparkles
  }
];

export const TentangKami = () => {
  const [activeTab, setActiveTab] = useState<"ipnu" | "ippnu">("ipnu");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    document.title = "Tentang Kami — PC IPNU IPPNU Kota Bekasi";
    window.scrollTo(0, 0);

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setParallaxY(window.scrollY);
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const historyData = activeTab === "ipnu" ? IPNU_HISTORY : IPPNU_HISTORY;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getHistoryParallaxOffset = (index: number, strength = 1) => {
    const sectionStart = 560;
    const itemDistance = 260;
    const rawOffset = (parallaxY - sectionStart - index * itemDistance) * 0.035 * strength;
    return Math.max(-22, Math.min(22, rawOffset));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* 1. RENDER HEADER UTAMA */}
      <Header />

      {/* 2. RENDER MAIN CONTENT AREA */}
      <main className="flex-grow pb-20 relative overflow-hidden z-10">
        
        {/* SUNTIKAN STYLE ANIMASI MAINSTREAM & MOTION EFFECT */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes drawLine {
            from { height: 0%; }
            to { height: 100%; }
          }
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
          @keyframes parallaxReveal {
            from {
              opacity: 0;
              filter: blur(8px);
            }
            to {
              opacity: 1;
              filter: blur(0);
            }
          }
          @keyframes slowZoom {
            from { opacity: 0.5; }
            to { opacity: 0.62; }
          }
          @keyframes historyGlowDrift {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.55; }
            50% { transform: translate3d(18px, -18px, 0) scale(1.08); opacity: 0.8; }
          }
          @keyframes historyLinePulse {
            0%, 100% { filter: drop-shadow(0 0 0 rgba(3, 68, 27, 0)); }
            50% { filter: drop-shadow(0 0 12px rgba(3, 68, 27, 0.35)); }
          }
          @keyframes pulseBorderGreen {
            0%, 100% { border-color: rgba(3, 68, 27, 0.2); box-shadow: 0 0 0 0px rgba(3, 68, 27, 0.1); }
            50% { border-color: rgba(3, 68, 27, 0.8); box-shadow: 0 0 15px 4px rgba(3, 68, 27, 0.15); }
          }
          @keyframes pulseBorderGold {
            0%, 100% { border-color: rgba(212, 175, 55, 0.2); box-shadow: 0 0 0 0px rgba(212, 175, 55, 0.1); }
            50% { border-color: rgba(212, 175, 55, 0.8); box-shadow: 0 0 15px 4px rgba(212, 175, 55, 0.15); }
          }
          .animate-draw-line {
            animation: drawLine 2s cubic-bezier(0.16, 1, 0.3 1) forwards;
          }
          .animate-fade-up {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-blob {
            animation: blobFloat 8s ease-in-out infinite;
          }
          .glow-active-green {
            animation: pulseBorderGreen 2s infinite;
          }
          .glow-active-gold {
            animation: pulseBorderGold 2s infinite;
          }
          .tentang-hero-copy {
            animation: parallaxReveal 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .tentang-hero-photo img {
            animation: slowZoom 8s ease-in-out infinite alternate;
          }
          .history-parallax-card,
          .history-parallax-year,
          .history-parallax-node,
          .history-parallax-bg {
            will-change: transform;
          }
          .history-parallax-shell {
            perspective: 1400px;
            transform-style: preserve-3d;
          }
          .history-parallax-card {
            transform-style: preserve-3d;
            transition: transform 180ms linear;
          }
          .history-card-surface {
            transform: translateZ(22px);
            backdrop-filter: blur(12px);
          }
          .history-parallax-year span {
            text-shadow: 0 18px 42px rgba(3, 68, 27, 0.14);
          }
          .history-parallax-watermark {
            -webkit-text-stroke: 1px rgba(3, 68, 27, 0.1);
            color: transparent;
            will-change: transform;
          }
          .history-parallax-glow {
            animation: historyGlowDrift 9s ease-in-out infinite;
          }
          .history-timeline-line {
            animation: historyLinePulse 3.8s ease-in-out infinite;
          }
        `}} />

        {/* BACKGROUND DEKORATIF GLOWING BLOB */}
        <div className="absolute top-1/3 left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none -z-10"></div>
        <div className="absolute top-2/3 right-[10%] w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-blob pointer-events-none -z-10" style={{ animationDelay: '3s' }}></div>

        {/* HERO SECTION */}
        <section className="relative min-h-[460px] overflow-hidden bg-primary-deep py-20 text-primary-foreground sm:min-h-[500px] lg:py-24">
          <div
            className="tentang-hero-photo absolute -inset-x-6 -top-16 bottom-[-7rem]"
            style={{ transform: `translate3d(0, ${Math.min(parallaxY * 0.18, 90)}px, 0) scale(1.08)` }}
            aria-hidden="true"
          >
            <img
              src={tentangHeroBg}
              alt=""
              className="h-full w-full object-cover opacity-55 mix-blend-luminosity"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#022b12]/95 via-[#03441b]/88 to-[#0b6623]/72" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,215,0,0.22),transparent_26rem),radial-gradient(circle_at_82%_76%,rgba(255,255,255,0.13),transparent_24rem)]"></div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent"></div>
          <div
            className="tentang-hero-copy container mx-auto px-5 lg:px-8 text-center relative z-10 flex min-h-[300px] flex-col items-center justify-center space-y-5"
            style={{ transform: `translate3d(0, ${Math.max(parallaxY * -0.08, -42)}px, 0)` }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-gold shadow-lg backdrop-blur-md sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 animate-spin" /> Kenali Jati Diri Kami
            </span>
            <h1 className="mx-auto max-w-5xl font-display text-3xl font-black uppercase italic leading-[1.05] tracking-normal transition-all duration-700 hover:scale-[1.01] sm:text-5xl lg:text-6xl">
              Belajar, Berjuang, <span className="text-gold">Bertaqwa</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm font-semibold leading-relaxed text-primary-foreground/85 lg:text-base">
              Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama & Ikatan Pelajar Putri Nahdlatul Ulama Kota Bekasi merupakan wadah perjuangan intelektual muda Aswaja di tanah patriot.
            </p>
          </div>
        </section>

        {/* INTERACTIVE HISTORY SECTION */}
        <section className="history-parallax-shell relative z-10 mt-20 overflow-hidden py-16">
          <div
            className="history-parallax-bg pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10 opacity-100"
            style={{ transform: `translate3d(0, ${Math.max(Math.min((parallaxY - 520) * -0.065, 34), -64)}px, 0) scale(1.04)` }}
            aria-hidden="true"
          >
            <img
              src={historyParallaxBg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.1] mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-50/85 to-background dark:via-emerald-950/10" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0_30%,rgba(3,68,27,0.06)_30%_31%,transparent_31%_100%)]" />
            <div className="history-parallax-glow absolute left-[8%] top-20 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
            <div className="history-parallax-glow absolute right-[10%] bottom-24 h-80 w-80 rounded-full bg-gold/12 blur-3xl" style={{ animationDelay: "2.2s" }} />
            <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" />
          </div>
          <div className="container mx-auto px-5 lg:px-8 max-w-5xl relative z-10">
          
          {/* Header Sejarah */}
          <div className="text-center space-y-2 mb-12">
            <h2 className="font-display font-black text-3xl lg:text-5xl text-primary uppercase tracking-tight">
              Gerbang Lorong Waktu
            </h2>
            <p className="text-xs lg:text-sm text-muted-foreground uppercase font-black tracking-[0.2em]">
              Alur Perjalanan Sejarah Berdirinya IPNU & IPPNU dari Masa ke Masa
            </p>
          </div>

          {/* TAB SWITCHER (IPNU / IPPNU) */}
          <div className="flex justify-center mb-16">
            <div className="bg-slate-100 p-2 rounded-full flex items-center relative shadow-inner border border-slate-200">
              <button
                onClick={() => { setActiveTab("ipnu"); setExpandedIndex(null); }}
                className={`px-10 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2.5 ${
                  activeTab === "ipnu"
                    ? "bg-primary text-white shadow-xl transform scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" /> IPNU (Putera)
              </button>
              <button
                onClick={() => { setActiveTab("ippnu"); setExpandedIndex(null); }}
                className={`px-10 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2.5 ${
                  activeTab === "ippnu"
                    ? "bg-gold text-gold-foreground shadow-xl transform scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className="h-4 w-4" /> IPPNU (Putri)
              </button>
            </div>
          </div>

          {/* VERTIKAL TIMELINE DENGAN ANIMASI PROGRESSIVE DRAW */}
          <div className="relative ml-4 md:ml-32 space-y-16 py-4">
            
            {/* Garis Tengah Belakang (Animasi Draw-Line) */}
            <div className="absolute left-[15px] top-4 bottom-4 w-1 overflow-hidden rounded-full bg-slate-200/80 shadow-inner">
              <div className={`history-timeline-line w-full bg-gradient-to-b animate-draw-line ${
                activeTab === 'ipnu' ? 'from-primary to-emerald-800' : 'from-gold to-yellow-600'
              }`} style={{ height: '100%' }}></div>
            </div>
            
            {historyData.map((item, idx) => {
              const IconComponent = item.icon;
              const isExpanded = expandedIndex === idx;
              const cardOffset = getHistoryParallaxOffset(idx, idx % 2 === 0 ? -0.75 : 0.55);
              const yearOffset = getHistoryParallaxOffset(idx, idx % 2 === 0 ? 0.95 : -0.8);
              const nodeOffset = getHistoryParallaxOffset(idx, idx % 2 === 0 ? -0.35 : 0.35);
              const cardTilt = Math.max(-2.2, Math.min(2.2, cardOffset * 0.08));
              const cardScale = 1 - Math.min(Math.abs(cardOffset) * 0.0012, 0.025);
              const watermarkOffset = getHistoryParallaxOffset(idx, idx % 2 === 0 ? -1.35 : 1.15);

              return (
                <div 
                  key={idx} 
                  className="relative group pl-8 md:pl-16 animate-fade-up"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <div
                    className="history-parallax-watermark pointer-events-none absolute -right-4 -top-14 hidden select-none font-display text-[8rem] font-black leading-none opacity-45 md:block"
                    style={{ transform: `translate3d(0, ${watermarkOffset}px, -80px)` }}
                    aria-hidden="true"
                  >
                    {item.year}
                  </div>
                  
                  {/* Node Bulat Timeline (Tahun) */}
                  <div className={`absolute -left-[3px] md:-left-[3px] top-1.5 h-10 w-10 rounded-full border-4 bg-background flex items-center justify-center transition-all duration-500 group-hover:scale-125 z-10 cursor-pointer ${
                    isExpanded 
                      ? (activeTab === "ipnu" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-gold text-gold-foreground border-gold shadow-lg shadow-gold/20") 
                      : "border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                  } history-parallax-node`} style={{ top: `calc(0.375rem + ${nodeOffset}px)` }}>
                    <IconComponent className="h-4 w-4" />
                  </div>

                  {/* Label Tahun di Sebelah Kiri (Desktop Only) */}
                  <div
                    className="history-parallax-year hidden md:block absolute -left-36 top-2 text-right w-28"
                    style={{ transform: `translate3d(0, ${yearOffset}px, 0)` }}
                  >
                    <span className={`text-3xl font-black font-display tracking-tight transition-all duration-500 block ${
                      isExpanded 
                        ? (activeTab === "ipnu" ? "text-primary text-4xl scale-105" : "text-gold text-4xl scale-105") 
                        : "text-slate-300 group-hover:text-slate-800"
                    }`}>
                      {item.year}
                    </span>
                  </div>

                  {/* Kartu Konten Sejarah (3D Tilt & Shadow Hover Effect) */}
                  <div
                    className="history-parallax-card"
                    style={{ transform: `translate3d(0, ${cardOffset}px, 0) rotateX(${cardTilt}deg) scale(${cardScale})` }}
                  >
                    <div 
                      onClick={() => toggleExpand(idx)}
                    className={`history-card-surface bg-white/95 rounded-3xl border p-6 md:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-500 cursor-pointer relative overflow-hidden group/card ${
                      isExpanded 
                        ? (activeTab === "ipnu" ? "border-primary/80 glow-active-green" : "border-gold/80 glow-active-gold") 
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/25 to-emerald-50/55 opacity-80" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/5 blur-2xl transition-transform duration-700 group-hover/card:scale-125" aria-hidden="true" />
                    <div className="relative z-10">
                    {/* Efek Garis Glow Pojok Atas */}
                    <div className={`absolute -left-6 -right-6 -top-6 h-1.5 transition-all duration-500 md:-left-8 md:-right-8 md:-top-8 ${
                      isExpanded 
                        ? (activeTab === "ipnu" ? "bg-primary" : "bg-gold") 
                        : "bg-transparent group-hover/card:bg-slate-300"
                    }`}></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {/* Label Tahun Mobile */}
                          <span className="md:hidden text-2xl font-black text-primary font-display">{item.year}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            activeTab === 'ipnu' ? 'bg-primary/10 text-primary' : 'bg-gold/10 text-gold-foreground'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <h3 className="font-display font-black text-xl md:text-2xl text-foreground group-hover/card:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" /> {item.date}
                        </p>
                      </div>
                      
                      {/* Tombol Panah Buka Tutup */}
                      <div className="flex items-center gap-2.5 self-end sm:self-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline-block opacity-0 group-hover/card:opacity-100 transition-opacity">
                          {isExpanded ? "Tutup" : "Baca Detail"}
                        </span>
                        <div className={`p-3 rounded-full transition-all duration-500 ${
                          isExpanded 
                            ? (activeTab === "ipnu" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gold text-gold-foreground shadow-lg shadow-gold/20") 
                            : "bg-slate-100 text-slate-500 group-hover/card:bg-primary group-hover/card:text-white"
                        }`}>
                          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Ringkasan Singkat */}
                    <p className="mt-4 text-sm lg:text-base text-slate-500 leading-relaxed font-medium">
                      {item.summary}
                    </p>

                    {/* Kisah Detail (Mulus Expand & Collapse) */}
                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[800px] opacity-100 mt-6 pt-6 border-t border-dashed border-slate-200" : "max-h-0 opacity-0 pointer-events-none"
                    }`}>
                      <div className="space-y-4 text-sm lg:text-base leading-relaxed text-slate-700">
                        <p className="font-medium">{item.details}</p>
                        <div className="flex flex-wrap gap-4 pt-3 text-xs uppercase font-black text-slate-400">
                          <span className="flex items-center gap-1">📍 Lokasi: <strong className="text-slate-800 font-black">{item.location}</strong></span>
                        </div>
                      </div>
                    </div>

                    </div>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
          </div>
        </section>

        {/* VISI & MISI DAN STRUKTURAL BANNER */}
        <section className="container mx-auto px-5 lg:px-8 mt-32 max-w-5xl relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card Visi */}
            <div className="bg-primary-deep text-primary-foreground p-10 rounded-3xl relative overflow-hidden shadow-2xl shadow-emerald-950/10 group transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5 blur-xl group-hover:scale-125 transition-transform duration-700"></div>
              <h3 className="font-display font-black text-2xl lg:text-3xl uppercase tracking-tight text-gold flex items-center gap-2">
                <Sparkles className="h-6 w-6 animate-pulse" /> Visi Juang
              </h3>
              <p className="mt-5 text-sm lg:text-base text-primary-foreground/85 leading-relaxed font-medium">
                Terwujudnya kader pelajar, santri, dan mahasiswa NU Kota Bekasi yang bertakwa kepada Allah SWT, berakhlakul karimah, unggul dalam intelektualitas, tangguh dalam organisasi, serta setia menjaga kedaulatan paham Aswaja dan NKRI.
              </p>
            </div>

            {/* Card Misi */}
            <div className="bg-white border border-slate-100 p-10 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-xl group transform transition-transform duration-500 hover:scale-[1.02]">
              <h3 className="font-display font-black text-2xl lg:text-3xl uppercase tracking-tight text-primary flex items-center gap-2">
                <BookOpen className="h-6 w-6" /> Misi Juang
              </h3>
              <ul className="mt-5 space-y-4 text-sm lg:text-base text-slate-600 leading-relaxed list-none">
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span>Membangun basis pertahanan kaderisasi di sekolah umum, pesantren, dan kampus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span>Mendorong literasi digital cerdas bagi pemuda NU di wilayah Kota Bekasi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span>Mengawal pemahaman dakwah Islam wasathiyah (moderat) demi keutuhan NKRI.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* CALL TO ACTION BUTTON KE HALAMAN STRUKTURAL */}
          <div className="mt-20 text-center">
            <Link 
              to="/struktural" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary hover:bg-[#023314] text-white rounded-full font-brand font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/20 hover:shadow-emerald-900/30 active:scale-95 group hover:-translate-y-0.5"
            >
              Lihat Struktur Kepengurusan Kami <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

        </section>

      </main>

      {/* 3. RENDER FOOTER UTAMA */}
      <Footer />

    </div>
  );
};

export default TentangKami;
