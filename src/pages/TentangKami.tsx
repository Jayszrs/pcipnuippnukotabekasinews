import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Flag,
  Heart,
  MapPin,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import tentangHeroBg from "@/assets/hero-news.jpg";
import historyParallaxBg from "@/assets/news-12.jpg";
import aboutSideImage from "@/assets/news-10.jpg";

type HistoryItem = {
  org: "IPNU" | "IPPNU";
  accent: "green" | "gold";
  year: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  details: string;
  badge: string;
  icon: LucideIcon;
};

const IPNU_HISTORY: HistoryItem[] = [
  {
    org: "IPNU",
    accent: "green",
    year: "1954",
    title: "Lahirnya Sang Ikatan",
    date: "24 Februari 1954 / 20 Jumadil Akhir 1373 H",
    location: "Semarang, Jawa Tengah",
    summary: "Dideklarasikan pada Kongres LP Ma'arif NU sebagai wadah perjuangan kaum pelajar laki-laki.",
    details:
      "Dipelopori oleh tokoh muda seperti Prof. Dr. KH. Tolchah Mansyur, Sofwan Kholil, dan Mustahal Ahmad. Pendirian ini lahir dari kebutuhan mengorganisir santri dan pelajar agar memiliki benteng ideologi Ahlussunnah wal Jama'ah sejak dini.",
    badge: "Kelahiran",
    icon: Flag,
  },
  {
    org: "IPNU",
    accent: "green",
    year: "1966",
    title: "Menjadi Badan Otonom Mandiri",
    date: "Kongres Surabaya 1966",
    location: "Surabaya, Jawa Timur",
    summary: "Resmi melepaskan diri dari LP Ma'arif untuk bergerak lebih lincah dan mandiri.",
    details:
      "Seiring pesatnya perkembangan organisasi, Kongres Surabaya memutuskan IPNU berdiri sebagai Badan Otonom NU langsung. Gerak kaderisasi pun meluas ke sekolah umum, pesantren, dan perguruan tinggi.",
    badge: "Kemandirian",
    icon: Award,
  },
  {
    org: "IPNU",
    accent: "green",
    year: "1988",
    title: "Represi Orde Baru dan Deklarasi Jombang",
    date: "29-31 Januari 1988",
    location: "Jombang, Jawa Timur",
    summary: "Berubah nama menjadi Ikatan Putera Nahdlatul Ulama demi menyiasati regulasi Orde Baru.",
    details:
      "UU No. 8/1985 membatasi organisasi pelajar selain OSIS di sekolah. Melalui Kongres ke-10 di Jombang, kata Pelajar diubah menjadi Putera agar organisasi tetap legal dan kaderisasi akar rumput tetap hidup.",
    badge: "Ketahanan",
    icon: Calendar,
  },
  {
    org: "IPNU",
    accent: "green",
    year: "2003",
    title: "Kembalinya Khittah Pelajar",
    date: "18-22 Juni 2003",
    location: "Surabaya, Jawa Timur",
    summary: "Mengembalikan nama Pelajar pasca runtuhnya rezim totaliter Orde Baru.",
    details:
      "Setelah reformasi membuka kebebasan berserikat, Kongres ke-14 IPNU di Surabaya memutuskan mengembalikan nama Ikatan Pelajar Nahdlatul Ulama. Fokus kaderisasi kembali diarahkan untuk pelajar, santri, dan mahasiswa.",
    badge: "Khittah",
    icon: Sparkles,
  },
];

const IPPNU_HISTORY: HistoryItem[] = [
  {
    org: "IPPNU",
    accent: "gold",
    year: "1955",
    title: "Fajar Baru Pelajar Putri",
    date: "2 Maret 1955 / 8 Rajab 1374 H",
    location: "Solo, Jawa Tengah",
    summary: "Didirikan oleh para santriwati tangguh untuk menjembatani perjuangan pelajar putri NU.",
    details:
      "Dipelopori oleh Nyai Hj. Umroh Mahfudzah, Syarifah Syahrazad, dan rekan-rekanwati Solo. Kelahiran IPPNU memberi ruang aktualisasi sosial keagamaan bagi perempuan muda NU.",
    badge: "Kelahiran",
    icon: Heart,
  },
  {
    org: "IPPNU",
    accent: "gold",
    year: "1966",
    title: "Berdiri Tegak Sebagai Banom",
    date: "Kongres Surabaya 1966",
    location: "Surabaya, Jawa Timur",
    summary: "IPPNU resmi diakui sebagai Badan Otonom mandiri setara dengan banom lainnya.",
    details:
      "IPPNU melepas ketergantungan struktural dari LP Ma'arif dan menjelma menjadi banom mandiri. Momentum ini memicu gelombang kepemimpinan kader perempuan NU di berbagai wilayah.",
    badge: "Kemandirian",
    icon: Award,
  },
  {
    org: "IPPNU",
    accent: "gold",
    year: "1988",
    title: "Era Penyesuaian Putri-Putri",
    date: "Kongres Jombang IX 1988",
    location: "Jombang, Jawa Timur",
    summary: "Penyesuaian nama menjadi Ikatan Putri-Putri Nahdlatul Ulama akibat regulasi Orde Baru.",
    details:
      "Demi menghindari pembubaran paksa oleh kebijakan keormasan, IPPNU menyesuaikan kepanjangannya. Fase ini menjadi saksi ketangguhan kaderwati menjaga api perjuangan Aswaja.",
    badge: "Keteguhan",
    icon: Calendar,
  },
  {
    org: "IPPNU",
    accent: "gold",
    year: "2003",
    title: "Kembalinya Marwah Pelajar Putri",
    date: "18-22 Juni 2003",
    location: "Surabaya, Jawa Timur",
    summary: "Nama Pelajar Putri resmi direbut kembali pada era reformasi.",
    details:
      "Melalui Kongres ke-13 di Surabaya, IPPNU kembali menjadi Ikatan Pelajar Putri Nahdlatul Ulama. Komitmen perjuangan diarahkan pada literasi, kepemimpinan perempuan muda, dan dakwah moderat.",
    badge: "Khittah",
    icon: Sparkles,
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const TentangKami = () => {
  const [parallaxY, setParallaxY] = useState(0);

  const historyData = useMemo(() => [...IPNU_HISTORY, ...IPPNU_HISTORY], []);

  useEffect(() => {
    document.title = "Tentang Kami - PC IPNU IPPNU Kota Bekasi";
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="relative flex-grow overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes aboutFloat {
                0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
                50% { transform: translate3d(18px, -22px, 0) scale(1.06); }
              }
              @keyframes aboutPulseLine {
                0%, 100% { opacity: .36; filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0)); }
                50% { opacity: 1; filter: drop-shadow(0 0 16px rgba(34, 197, 94, .48)); }
              }
              @keyframes aboutKineticText {
                0% {
                  opacity: .42;
                  transform: translate3d(0, 34px, 0) scale(.985);
                }
                28% {
                  opacity: 1;
                  transform: translate3d(0, 0, 0) scale(1);
                }
                62% {
                  opacity: 1;
                  transform: translate3d(0, -4px, 0) scale(1);
                }
                100% {
                  opacity: .96;
                  transform: translate3d(0, -10px, 0) scale(1);
                }
              }
              @keyframes aboutGlowWord {
                0%, 100% { text-shadow: 0 0 0 transparent; }
                50% { text-shadow: 0 0 22px rgba(255, 215, 0, .42), 0 0 42px rgba(34, 197, 94, .2); }
              }
              .about-float-a { animation: aboutFloat 9s ease-in-out infinite; }
              .about-float-b { animation: aboutFloat 11s ease-in-out infinite reverse; }
              .about-line-glow { animation: aboutPulseLine 4s ease-in-out infinite; }
              .about-slide-copy {
                animation: aboutKineticText linear both;
                animation-timeline: view();
                animation-range: entry 0% exit 100%;
                will-change: transform, opacity;
              }
              .about-glow-word { animation: aboutGlowWord 3.6s ease-in-out infinite; }
              .about-noise {
                background-image:
                  linear-gradient(115deg, transparent 0 44%, hsl(var(--gold) / .09) 44% 45%, transparent 45% 100%),
                  radial-gradient(circle at 22% 18%, hsl(var(--gold) / .18), transparent 22rem),
                  radial-gradient(circle at 82% 82%, hsl(var(--primary) / .24), transparent 28rem);
              }
              @media (prefers-reduced-motion: reduce) {
                .about-float-a,
                .about-float-b,
                .about-line-glow,
                .about-glow-word,
                .about-slide-copy {
                  animation-duration: 1ms;
                  animation-iteration-count: 1;
                }
              }
            `,
          }}
        />

        <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#03150b] text-white">
          <div
            className="absolute -inset-x-8 -top-16 bottom-[-8rem]"
            style={{ transform: `translate3d(0, ${clamp(parallaxY * 0.18, 0, 120)}px, 0) scale(1.08)` }}
            aria-hidden="true"
          >
            <img src={tentangHeroBg} alt="" className="h-full w-full object-cover opacity-45 mix-blend-luminosity" />
          </div>
          <div className="about-noise absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020806]/65 via-[#032313]/86 to-background" />
          <div className="about-float-a absolute left-[8%] top-[18%] h-52 w-52 rounded-full bg-gold/20 blur-3xl" />
          <div className="about-float-b absolute right-[10%] bottom-[18%] h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

          <div
            className="container-news relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-24"
            style={{ transform: `translate3d(0, ${clamp(parallaxY * -0.08, -58, 0)}px, 0)` }}
          >
            <div className="max-w-5xl">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.34em] text-gold">
                Tentang Kami
              </p>
              <h1 className="mt-5 max-w-5xl font-display text-4xl font-black uppercase leading-[0.96] sm:text-6xl lg:text-7xl">
                Belajar, Berjuang, <span className="about-glow-word text-gold">Bertaqwa</span>
              </h1>
              <p className="mt-7 max-w-2xl text-sm font-semibold leading-8 text-white/78 sm:text-base">
                PC IPNU IPPNU Kota Bekasi adalah ruang kaderisasi pelajar NU yang merawat ilmu,
                akhlak, organisasi, dan keberanian sosial dalam satu napas perjuangan.
              </p>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {[
                ["Aswaja", "Akar nilai yang menjaga arah gerak."],
                ["Literasi", "Daya baca, daya pikir, dan daya cipta."],
                ["Khidmah", "Kerja sunyi untuk umat dan pelajar."],
              ].map(([title, text]) => (
                <div key={title} className="border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                  <p className="font-display text-xl font-black text-gold">{title}</p>
                  <p className="mt-2 text-xs font-semibold leading-6 text-white/68">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-background py-28 lg:py-36">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{ transform: `translate3d(0, ${clamp((parallaxY - 520) * -0.05, -80, 48)}px, 0) scale(1.04)` }}
            aria-hidden="true"
          >
            <img src={historyParallaxBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.08] mix-blend-multiply dark:opacity-[0.13]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-50/70 to-background dark:via-emerald-950/18" />
            <div className="about-float-a absolute left-[10%] top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
            <div className="about-float-b absolute right-[8%] bottom-36 h-80 w-80 rounded-full bg-gold/12 blur-3xl" />
          </div>

          <div className="container-news relative z-10">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Lorong Waktu</p>
                <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                  Jejak kaderisasi yang hidup di Bekasi
                </h2>
                <p className="mt-5 text-sm font-semibold leading-7 text-muted-foreground">
                  Dari akar sejarah IPNU IPPNU sampai kerja kader hari ini, halaman ini merangkum
                  napas organisasi: belajar dengan tekun, bergerak bersama, dan berkhidmah untuk pelajar.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/struktural"
                    data-nav-loader-label="Struktural"
                    className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-primary-foreground shadow-elevated transition-all hover:-translate-y-0.5 hover:bg-primary-deep dark:hover:bg-primary"
                  >
                    Lihat Struktural
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#sejarah-ipnu-ippnu"
                    className="inline-flex items-center justify-center border border-border bg-card px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                  >
                    Baca Sejarah
                  </a>
                </div>
              </div>

              <div className="relative min-h-[340px] overflow-hidden border border-border bg-card shadow-2xl shadow-black/10 dark:shadow-black/40 sm:min-h-[420px]">
                <img
                  src={aboutSideImage}
                  alt="Kader IPNU IPPNU Kota Bekasi berbagi paket kegiatan sosial"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020806]/90 via-[#020806]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-gold">Khidmah Pelajar</p>
                  <h3 className="mt-3 max-w-md font-display text-2xl font-black uppercase leading-tight text-white sm:text-3xl">
                    Ruang belajar, gerak sosial, dan kepemimpinan muda NU
                  </h3>
                  <div className="mt-5 grid grid-cols-3 border border-white/10 bg-white/[0.08] text-center backdrop-blur-sm">
                    {[
                      ["12", "PAC"],
                      ["2", "Ikatan"],
                      ["1", "Khidmah"],
                    ].map(([number, label]) => (
                      <div key={label} className="border-r border-white/10 px-3 py-4 last:border-r-0">
                        <p className="font-display text-2xl font-black text-gold">{number}</p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/72">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="sejarah-ipnu-ippnu" className="relative mx-auto mt-24 max-w-6xl scroll-mt-28">
              <div className="about-line-glow absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent md:left-1/2" />

              {historyData.map((item, index) => {
                const Icon = item.icon;
                const isGold = item.accent === "gold";
                const isRight = index % 2 === 1;
                const offset = clamp((parallaxY - 820 - index * 430) * (isRight ? 0.028 : -0.028), -28, 28);

                return (
                  <article
                    key={`${item.org}-${item.year}-${item.title}`}
                    className={`relative min-h-[76vh] py-12 md:grid md:grid-cols-2 md:gap-16 ${isRight ? "md:[&>*:first-child]:col-start-2" : ""}`}
                  >
                    <div
                      className="about-slide-copy relative ml-10 md:ml-0"
                      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
                    >
                      <div
                        className={`absolute -left-[3.15rem] top-3 grid h-10 w-10 place-items-center rounded-full border bg-background md:left-auto ${
                          isRight ? "md:-left-[5.6rem]" : "md:-right-[5.6rem]"
                        } ${isGold ? "border-gold text-gold shadow-gold/30" : "border-primary text-primary shadow-primary/30"} shadow-lg`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="relative overflow-hidden border border-border/70 bg-card/88 p-6 shadow-2xl shadow-black/5 backdrop-blur-md dark:bg-card/72 sm:p-8 lg:p-10">
                        <div
                          className={`absolute inset-x-0 top-0 h-1.5 ${
                            isGold ? "bg-gradient-to-r from-gold via-yellow-300 to-gold" : "bg-gradient-to-r from-primary via-emerald-400 to-primary"
                          }`}
                        />
                        <div className={`absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl ${isGold ? "bg-gold/16" : "bg-primary/16"}`} />
                        <p className={`font-display text-5xl font-black leading-none sm:text-6xl ${isGold ? "text-gold" : "text-primary"}`}>
                          {item.year}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                              isGold ? "bg-gold/15 text-gold-foreground dark:text-gold" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {item.org}
                          </span>
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {item.badge}
                          </span>
                        </div>
                        <h3 className="mt-5 font-display text-2xl font-black leading-tight sm:text-3xl">
                          {item.title}
                        </h3>
                        <p className="mt-4 text-base font-bold leading-8 text-foreground/78">
                          {item.summary}
                        </p>
                        <p className="mt-5 text-sm font-medium leading-8 text-muted-foreground">
                          {item.details}
                        </p>
                        <div className="mt-7 grid gap-3 border-t border-dashed border-border pt-5 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-2">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {item.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#04140b] py-28 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,hsl(var(--gold)_/_0.18),transparent_24rem),radial-gradient(circle_at_88%_76%,hsl(var(--primary)_/_0.34),transparent_30rem)]" />
          <div className="container-news relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Arah Gerak</p>
              <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
                Visi yang tidak berhenti di poster
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="about-slide-copy border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md">
                <Sparkles className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-black text-gold">Visi Juang</h3>
                <p className="mt-4 text-sm font-semibold leading-8 text-white/74">
                  Terwujudnya kader pelajar, santri, dan mahasiswa NU Kota Bekasi yang bertakwa,
                  berakhlakul karimah, unggul secara intelektual, dan setia menjaga Aswaja serta NKRI.
                </p>
              </div>
              <div className="about-slide-copy border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md">
                <BookOpen className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-display text-2xl font-black text-gold">Misi Juang</h3>
                <p className="mt-4 text-sm font-semibold leading-8 text-white/74">
                  Menguatkan kaderisasi sekolah, pesantren, dan kampus; mendorong literasi digital;
                  serta mengawal dakwah Islam wasathiyah di ruang pelajar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TentangKami;
