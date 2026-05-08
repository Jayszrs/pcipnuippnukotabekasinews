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

  useEffect(() => {
    document.title = "Tentang Kami — PC IPNU IPPNU Kota Bekasi";
    window.scrollTo(0, 0);
  }, []);

  const historyData = activeTab === "ipnu" ? IPNU_HISTORY : IPPNU_HISTORY;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-20 bg-primary-deep text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.15),transparent_50%)]"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="container mx-auto px-5 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold text-xs font-black uppercase tracking-widest rounded-full">
            <Sparkles className="h-3 w-3 animate-spin" /> Kenali Jati Diri Kami
          </span>
          <h1 className="font-display font-black text-4xl lg:text-6xl uppercase tracking-tight italic">
            Belajar, Berjuang, <span className="text-gold">Bertaqwa</span>
          </h1>
          <p className="text-sm lg:text-base text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama & Ikatan Pelajar Putri Nahdlatul Ulama Kota Bekasi merupakan wadah perjuangan intelektual muda Aswaja di tanah patriot.
          </p>
        </div>
      </section>

      {/* 2. INTERACTIVE HISTORY SECTION */}
      <section className="container mx-auto px-5 lg:px-8 mt-16 max-w-5xl">
        
        {/* Header Sejarah */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-display font-black text-2xl lg:text-4xl text-primary uppercase tracking-tight">
            Gerbang Lorong Waktu
          </h2>
          <p className="text-xs lg:text-sm text-muted-foreground uppercase font-bold tracking-wider">
            Alur Perjalanan Sejarah Berdirinya IPNU & IPPNU dari Masa ke Masa
          </p>
        </div>

        {/* TAB SWITCHER (IPNU / IPPNU) */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted p-1.5 rounded-full flex items-center relative shadow-inner">
            <button
              onClick={() => { setActiveTab("ipnu"); setExpandedIndex(null); }}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "ipnu"
                  ? "bg-primary text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" /> IPNU (Putera)
            </button>
            <button
              onClick={() => { setActiveTab("ippnu"); setExpandedIndex(null); }}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "ippnu"
                  ? "bg-gold text-gold-foreground shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="h-4 w-4" /> IPPNU (Putri)
            </button>
          </div>
        </div>

        {/* VERTIKAL TIMELINE DENGAN ANIMASI HOVER & CLICK */}
        <div className="relative border-l-2 border-dashed border-muted ml-4 md:ml-32 space-y-12 py-4">
          
          {historyData.map((item, idx) => {
            const IconComponent = item.icon;
            const isExpanded = expandedIndex === idx;

            return (
              <div key={idx} className="relative group pl-8 md:pl-12 transition-all duration-500">
                
                {/* Node Bulat Timeline (Tahun) */}
                <div className={`absolute -left-[17px] top-1.5 h-8 w-8 rounded-full border-2 bg-background flex items-center justify-center transition-all duration-500 group-hover:scale-125 ${
                  isExpanded 
                    ? (activeTab === "ipnu" ? "bg-primary text-white border-primary" : "bg-gold text-gold-foreground border-gold") 
                    : "border-muted text-muted-foreground"
                }`}>
                  <IconComponent className="h-4 w-4" />
                </div>

                {/* Label Tahun di Sebelah Kiri (Desktop Only) */}
                <div className="hidden md:block absolute -left-32 top-2 text-right w-24">
                  <span className={`text-xl font-black font-display tracking-tight transition-all duration-300 ${
                    isExpanded 
                      ? (activeTab === "ipnu" ? "text-primary text-2xl" : "text-gold text-2xl") 
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {item.year}
                  </span>
                </div>

                {/* Kartu Konten Sejarah */}
                <div 
                  onClick={() => toggleExpand(idx)}
                  className={`bg-white rounded-2xl border border-border p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer relative overflow-hidden group/card ${
                    isExpanded ? `ring-2 ${activeTab === "ipnu" ? "ring-primary/20 border-primary" : "ring-gold/20 border-gold"}` : "hover:border-slate-300"
                  }`}
                >
                  {/* Efek Garis Glow Pojok Atas */}
                  <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
                    isExpanded 
                      ? (activeTab === "ipnu" ? "bg-primary" : "bg-gold") 
                      : "bg-transparent group-hover/card:bg-muted-foreground/20"
                  }`}></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {/* Label Tahun Mobile */}
                        <span className="md:hidden text-lg font-black text-primary font-display">{item.year}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-muted rounded text-muted-foreground">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base md:text-lg text-foreground group-hover/card:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {item.date}
                      </p>
                    </div>
                    
                    {/* Tombol Panah Buka Tutup */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden group-hover/card:inline transition-opacity">
                        {isExpanded ? "Tutup" : "Baca Detail"}
                      </span>
                      <div className={`p-2 rounded-full transition-all duration-300 ${
                        isExpanded 
                          ? (activeTab === "ipnu" ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold") 
                          : "bg-muted text-muted-foreground group-hover/card:bg-foreground group-hover/card:text-white"
                      }`}>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Ringkasan Singkat */}
                  <p className="mt-4 text-xs lg:text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Kisah Detail */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    isExpanded ? "max-h-[500px] opacity-100 mt-5 pt-5 border-t border-dashed border-border" : "max-h-0 opacity-0"
                  }`}>
                    <div className="space-y-4 text-xs lg:text-sm leading-relaxed text-foreground/90">
                      <p>{item.details}</p>
                      <div className="flex flex-wrap gap-4 pt-2 text-[10px] uppercase font-bold text-slate-400">
                        <span>📍 Lokasi: <strong className="text-foreground">{item.location}</strong></span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* 3. VISI & MISI DAN STRUKTURAL BANNER */}
      <section className="container mx-auto px-5 lg:px-8 mt-24 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card Visi */}
          <div className="bg-primary-deep text-primary-foreground p-8 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/10 group">
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5 blur-xl group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight text-gold flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Visi Juang
            </h3>
            <p className="mt-4 text-xs lg:text-sm text-primary-foreground/85 leading-relaxed">
              Terwujudnya kader pelajar, santri, dan mahasiswa NU Kota Bekasi yang bertakwa kepada Allah SWT, berakhlakul karimah, unggul dalam intelektualitas, tangguh dalam organisasi, serta setia menjaga kedaulatan paham Aswaja dan NKRI.
            </p>
          </div>

          {/* Card Misi */}
          <div className="bg-white border border-border p-8 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <h3 className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight text-primary flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Misi Juang
            </h3>
            <ul className="mt-4 space-y-3 text-xs lg:text-sm text-muted-foreground leading-relaxed list-disc list-inside">
              <li>Membangun basis pertahanan kaderisasi di sekolah umum, pesantren, dan kampus.</li>
              <li>Mendorong literasi digital cerdas bagi pemuda NU di wilayah Kota Bekasi.</li>
              <li>Mengawal pemahaman dakwah Islam wasathiyah (moderat) demi keutuhan NKRI.</li>
            </ul>
          </div>

        </div>

        {/* CALL TO ACTION BUTTON KE HALAMAN STRUKTURAL */}
        <div className="mt-16 text-center">
          <Link 
            to="/struktural" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-[#023314] text-white rounded-full font-brand font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/10 hover:shadow-emerald-900/20 active:scale-95 group"
          >
            Lihat Struktur Kepengurusan Kami <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </section>

    </div>
  );
};

export default TentangKami;