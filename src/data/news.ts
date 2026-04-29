import hero from "@/assets/hero-news.jpg";
import n1 from "@/assets/news-1.jpg";
import n2 from "@/assets/news-2.jpg";
import n3 from "@/assets/news-3.jpg";
import n4 from "@/assets/news-4.jpg";
import n5 from "@/assets/news-5.jpg";
import n6 from "@/assets/news-6.jpg";
import n7 from "@/assets/news-7.jpg";
import n8 from "@/assets/news-8.jpg";
import n9 from "@/assets/news-9.jpg";
import n10 from "@/assets/news-10.jpg";
import n11 from "@/assets/news-11.jpg";
import n12 from "@/assets/news-12.jpg";

export type Category =
  | "Kegiatan IPNU"
  | "Kegiatan IPPNU"
  | "Bekasi Update"
  | "Nasional"
  | "Opini";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  category: Category;
  author: string;
  date: string;
  readTime: number;
  views: number;
  tags: string[];
  featured?: boolean;
}

export const categories: Category[] = [
  "Kegiatan IPNU",
  "Kegiatan IPPNU",
  "Bekasi Update",
  "Nasional",
  "Opini",
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "konferensi-cabang-ipnu-ippnu-kota-bekasi-2026",
    title:
      "Konferensi Cabang IPNU IPPNU Kota Bekasi 2026 Resmi Dibuka, Ribuan Pelajar NU Hadir",
    excerpt:
      "Konferensi Cabang ke-IX IPNU IPPNU Kota Bekasi resmi dibuka di Aula Pemkot Bekasi dengan menghadirkan ribuan kader pelajar Nahdlatul Ulama dari seluruh kecamatan.",
    content: [
      "BEKASI — Konferensi Cabang (Konfercab) ke-IX Ikatan Pelajar Nahdlatul Ulama (IPNU) dan Ikatan Pelajar Putri Nahdlatul Ulama (IPPNU) Kota Bekasi resmi dibuka pada Sabtu (25/4/2026) di Aula Pemerintah Kota Bekasi. Acara ini dihadiri lebih dari 1.500 kader pelajar NU dari 12 Pimpinan Anak Cabang (PAC) se-Kota Bekasi.",
      "Ketua Pimpinan Cabang IPNU Kota Bekasi menyampaikan bahwa konfercab kali ini mengusung tema 'Pelajar NU Bekasi: Berilmu, Beradab, Berkhidmat'. Tema tersebut, menurutnya, mencerminkan komitmen IPNU IPPNU untuk terus mencetak kader pelajar yang tidak hanya unggul secara akademik tetapi juga matang secara spiritual.",
      "Hadir pula dalam pembukaan tersebut perwakilan PCNU Kota Bekasi, Pemerintah Kota Bekasi, serta sejumlah tokoh ulama dan kiai. Dalam sambutannya, Wali Kota Bekasi mengapresiasi konsistensi IPNU IPPNU dalam mengawal nilai-nilai Aswaja di kalangan pelajar.",
      "Konfercab akan berlangsung selama tiga hari dan diisi dengan berbagai agenda strategis, mulai dari sidang komisi, pemilihan ketua baru, hingga pelatihan kepemimpinan untuk kader muda.",
    ],
    image: hero,
    category: "Kegiatan IPNU",
    author: "Redaksi PC IPNU Bekasi",
    date: "25 April 2026",
    readTime: 4,
    views: 2840,
    tags: ["Konfercab", "IPNU", "IPPNU", "Bekasi", "Aswaja"],
    featured: true,
  },
  {
    id: "2",
    slug: "ippnu-bekasi-gelar-kajian-muslimah-milenial",
    title:
      "IPPNU Bekasi Gelar Kajian Muslimah Milenial: Menjaga Iman di Era Digital",
    excerpt:
      "Ratusan pelajar putri mengikuti kajian rutin bulanan IPPNU dengan tema literasi digital dan akhlak muslimah modern.",
    content: [
      "BEKASI — Pimpinan Cabang IPPNU Kota Bekasi menggelar kajian rutin bulanan bertajuk 'Muslimah Milenial: Menjaga Iman di Era Digital' pada Minggu (20/4/2026). Acara berlangsung di Gedung NU Kota Bekasi dan diikuti lebih dari 300 pelajar putri.",
      "Kajian menghadirkan Ustadzah Nyai Hj. Aminah sebagai pemateri utama. Dalam paparannya, beliau menekankan pentingnya filter informasi dan menjaga adab di media sosial sebagai bagian dari ibadah.",
      "Ketua PC IPPNU Bekasi mengatakan kegiatan ini adalah bagian dari program literasi digital berkelanjutan yang akan digelar setiap bulan di lokasi yang berbeda-beda.",
    ],
    image: n1,
    category: "Kegiatan IPPNU",
    author: "Siti Nurhaliza",
    date: "21 April 2026",
    readTime: 3,
    views: 1520,
    tags: ["IPPNU", "Kajian", "Muslimah", "Literasi"],
    featured: true,
  },
  {
    id: "3",
    slug: "bekasi-bangun-pusat-kajian-islam-pelajar",
    title: "Pemkot Bekasi Bangun Pusat Kajian Islam Pelajar di Kawasan Bekasi Timur",
    excerpt:
      "Fasilitas baru ini diharapkan menjadi rumah bersama bagi pelajar lintas organisasi keagamaan di Kota Bekasi.",
    content: [
      "BEKASI — Pemerintah Kota Bekasi mengumumkan pembangunan Pusat Kajian Islam Pelajar (PKIP) di kawasan Bekasi Timur. Proyek ini ditargetkan rampung pada akhir 2026.",
      "PKIP akan dilengkapi perpustakaan digital, ruang diskusi, dan auditorium berkapasitas 500 orang. IPNU IPPNU disebut akan menjadi salah satu mitra utama pengelola fasilitas tersebut.",
    ],
    image: n2,
    category: "Bekasi Update",
    author: "Ahmad Fauzi",
    date: "19 April 2026",
    readTime: 3,
    views: 980,
    tags: ["Bekasi", "Pendidikan", "Pelajar"],
  },
  {
    id: "4",
    slug: "pelantikan-pengurus-pac-ipnu-medansatria",
    title: "Pelantikan Pengurus PAC IPNU IPPNU Medan Satria Berlangsung Khidmat",
    excerpt:
      "Pengurus baru periode 2026-2028 dilantik dengan komitmen memperkuat basis kader di tingkat ranting dan komisariat.",
    content: [
      "BEKASI — Pelantikan Pengurus Anak Cabang (PAC) IPNU IPPNU Kecamatan Medan Satria periode 2026-2028 berlangsung khidmat pada Sabtu (18/4/2026) di Masjid Al-Hidayah.",
      "Acara dihadiri oleh PC IPNU IPPNU Kota Bekasi, MWC NU Medan Satria, serta para alumni dan senior organisasi.",
    ],
    image: n3,
    category: "Kegiatan IPNU",
    author: "Redaksi",
    date: "18 April 2026",
    readTime: 2,
    views: 740,
    tags: ["Pelantikan", "PAC", "Medan Satria"],
  },
  {
    id: "5",
    slug: "aksi-sosial-ramadhan-ipnu-ippnu-bekasi",
    title: "Aksi Sosial Ramadhan: IPNU IPPNU Bekasi Bagikan 1.000 Paket Sembako",
    excerpt:
      "Program sosial tahunan ini menjangkau warga prasejahtera di 12 kecamatan se-Kota Bekasi.",
    content: [
      "BEKASI — Dalam rangka memperingati Nuzulul Quran, IPNU IPPNU Kota Bekasi menggelar aksi sosial pembagian 1.000 paket sembako kepada warga prasejahtera.",
      "Aksi ini melibatkan ratusan relawan kader IPNU IPPNU dari seluruh PAC se-Kota Bekasi.",
    ],
    image: n4,
    category: "Kegiatan IPPNU",
    author: "Tim Sosial",
    date: "15 April 2026",
    readTime: 3,
    views: 1340,
    tags: ["Ramadhan", "Sosial", "Sembako"],
  },
  {
    id: "6",
    slug: "tadarus-akbar-pelajar-nu-bekasi",
    title: "Tadarus Akbar Pelajar NU Bekasi Khatamkan Al-Qur'an dalam 24 Jam",
    excerpt:
      "Sebanyak 300 santri dan pelajar NU sukses mengkhatamkan Al-Qur'an dalam kegiatan tadarus akbar non-stop.",
    content: [
      "BEKASI — Pelajar NU se-Kota Bekasi menggelar tadarus akbar selama 24 jam non-stop di Pondok Pesantren Al-Falah.",
      "Kegiatan ini diikuti 300 santri dan pelajar yang dibagi dalam puluhan kelompok bergiliran membaca Al-Qur'an.",
    ],
    image: n5,
    category: "Kegiatan IPNU",
    author: "Muhammad Hasan",
    date: "12 April 2026",
    readTime: 2,
    views: 890,
    tags: ["Tadarus", "Al-Quran", "Santri"],
  },
  {
    id: "7",
    slug: "opini-peran-pelajar-nu-di-era-ai",
    title: "Opini: Peran Pelajar NU di Era Kecerdasan Buatan",
    excerpt:
      "Bagaimana pelajar Nahdlatul Ulama harus menyikapi gelombang teknologi AI tanpa kehilangan identitas keislaman.",
    content: [
      "Era kecerdasan buatan (AI) menghadirkan tantangan baru bagi pelajar muslim. Di satu sisi, AI membuka akses pengetahuan yang luar biasa; di sisi lain, ia berpotensi menggerus daya nalar kritis dan adab keilmuan.",
      "Pelajar NU memiliki modal kuat berupa tradisi keilmuan pesantren yang menekankan adab sebelum ilmu. Modal inilah yang harus dijaga dan dikontekstualisasikan dengan tantangan zaman.",
    ],
    image: n6,
    category: "Opini",
    author: "Gus Fahmi Aziz",
    date: "10 April 2026",
    readTime: 5,
    views: 2150,
    tags: ["Opini", "AI", "Teknologi", "Pelajar NU"],
  },
  {
    id: "8",
    slug: "pbnu-tegaskan-komitmen-kaderisasi-pelajar",
    title:
      "PBNU Tegaskan Komitmen Penguatan Kaderisasi Pelajar di Seluruh Indonesia",
    excerpt:
      "Pengurus Besar Nahdlatul Ulama meluncurkan roadmap kaderisasi pelajar 2026-2030 yang menyasar IPNU IPPNU di seluruh provinsi.",
    content: [
      "JAKARTA — Pengurus Besar Nahdlatul Ulama (PBNU) meluncurkan roadmap kaderisasi pelajar nasional periode 2026-2030.",
      "Program ini menyasar penguatan kapasitas pengurus IPNU IPPNU di seluruh provinsi, termasuk Kota Bekasi.",
    ],
    image: n2,
    category: "Nasional",
    author: "Antara NU",
    date: "8 April 2026",
    readTime: 3,
    views: 3420,
    tags: ["PBNU", "Nasional", "Kaderisasi"],
  },
  {
    id: "9",
    slug: "ipnu-bekasi-juara-lomba-debat-aswaja",
    title: "IPNU Bekasi Sabet Juara 1 Lomba Debat Aswaja Tingkat Jabodetabek",
    excerpt:
      "Tim debat IPNU Kota Bekasi berhasil mengalahkan 24 tim dari berbagai daerah dalam ajang debat keagamaan bergengsi.",
    content: [
      "BEKASI — Tim debat Pimpinan Cabang IPNU Kota Bekasi sukses meraih juara pertama dalam Lomba Debat Aswaja se-Jabodetabek yang digelar di Universitas Nahdlatul Ulama Indonesia, Sabtu (5/4/2026).",
      "Dengan mengangkat tema 'Moderasi Beragama di Tengah Polarisasi Sosial', tim Bekasi tampil meyakinkan di babak final melawan IPNU Jakarta Selatan.",
      "Kemenangan ini menjadi bukti kuatnya tradisi keilmuan pelajar NU Kota Bekasi yang konsisten dibina melalui kajian mingguan.",
    ],
    image: n7,
    category: "Kegiatan IPNU",
    author: "Tim Redaksi",
    date: "5 April 2026",
    readTime: 3,
    views: 1820,
    tags: ["Debat", "Aswaja", "Prestasi", "Jabodetabek"],
  },
  {
    id: "10",
    slug: "ippnu-bekasi-buka-kelas-tahfidz-online",
    title: "IPPNU Bekasi Buka Kelas Tahfidz Online Gratis untuk Pelajar Putri",
    excerpt:
      "Program Tahfidz Online IPPNU menyasar 500 pelajar putri dengan metode talaqqi dan setoran via Zoom.",
    content: [
      "BEKASI — Departemen Dakwah PC IPPNU Kota Bekasi resmi membuka kelas tahfidz Al-Qur'an online gratis bagi pelajar putri se-Kota Bekasi.",
      "Program ini akan berlangsung selama 6 bulan dengan metode talaqqi dan setoran hafalan via Zoom setiap malam ba'da Maghrib.",
      "Pendaftaran dibuka melalui website resmi PC IPPNU Bekasi dan ditargetkan menampung 500 peserta dari berbagai jenjang pendidikan.",
    ],
    image: n8,
    category: "Kegiatan IPPNU",
    author: "Nur Fadilah",
    date: "3 April 2026",
    readTime: 3,
    views: 1240,
    tags: ["Tahfidz", "Online", "Dakwah", "IPPNU"],
    featured: true,
  },
  {
    id: "11",
    slug: "halaqah-kitab-kuning-pelajar-nu-bekasi",
    title: "Halaqah Kitab Kuning Pelajar NU Bekasi Kembali Digelar di Pesantren Al-Hikmah",
    excerpt:
      "Kegiatan rutin tahunan ini menghadirkan kiai-kiai sepuh untuk membaca kitab Fathul Qarib dan Bulughul Maram.",
    content: [
      "BEKASI — Halaqah kitab kuning yang menjadi tradisi tahunan IPNU IPPNU Kota Bekasi kembali digelar di Pondok Pesantren Al-Hikmah, Bantargebang.",
      "Sebanyak 200 pelajar NU mengikuti pembacaan kitab Fathul Qarib dan Bulughul Maram yang dipimpin langsung oleh KH Mahfudz Asy'ari.",
      "Kegiatan ini bertujuan memperkuat sanad keilmuan pesantren di kalangan pelajar generasi Z.",
    ],
    image: n9,
    category: "Kegiatan IPNU",
    author: "Abdul Karim",
    date: "1 April 2026",
    readTime: 3,
    views: 670,
    tags: ["Halaqah", "Kitab Kuning", "Pesantren", "Sanad"],
  },
  {
    id: "12",
    slug: "ipnu-ippnu-bekasi-bantu-korban-banjir",
    title: "Solidaritas Pelajar: IPNU IPPNU Bekasi Salurkan Bantuan untuk Korban Banjir Pondok Gede",
    excerpt:
      "Lebih dari 800 paket bantuan disalurkan ke 5 titik pengungsian banjir oleh relawan pelajar NU.",
    content: [
      "BEKASI — Tim relawan IPNU IPPNU Kota Bekasi menyalurkan bantuan kepada korban banjir di kawasan Pondok Gede yang terdampak luapan Kali Bekasi.",
      "Bantuan berupa makanan siap saji, pakaian layak pakai, popok bayi, dan obat-obatan dengan total lebih dari 800 paket.",
      "Posko bantuan didirikan di Masjid Jami Al-Ikhlas dan akan terus aktif hingga kondisi pemulihan berlangsung.",
    ],
    image: n10,
    category: "Bekasi Update",
    author: "Tim Tanggap Bencana",
    date: "29 Maret 2026",
    readTime: 4,
    views: 2340,
    tags: ["Banjir", "Bantuan", "Solidaritas", "Pondok Gede"],
    featured: true,
  },
  {
    id: "13",
    slug: "konferensi-pelajar-aswaja-nasional-2026",
    title: "Konferensi Pelajar Aswaja Nasional 2026 Akan Digelar di Kota Bekasi",
    excerpt:
      "PC IPNU Bekasi terpilih menjadi tuan rumah Konferensi Pelajar Aswaja Nasional yang akan dihadiri 32 provinsi.",
    content: [
      "BEKASI — Pengurus Pusat IPNU mengumumkan bahwa Kota Bekasi terpilih sebagai tuan rumah Konferensi Pelajar Aswaja Nasional (KPAN) 2026.",
      "Acara akan digelar pada Juli 2026 dan dihadiri perwakilan IPNU IPPNU dari 32 provinsi di Indonesia.",
      "Wali Kota Bekasi menyatakan komitmen mendukung penuh penyelenggaraan event nasional ini.",
    ],
    image: n11,
    category: "Nasional",
    author: "Redaksi",
    date: "27 Maret 2026",
    readTime: 3,
    views: 1980,
    tags: ["KPAN", "Aswaja", "Nasional", "Konferensi"],
  },
  {
    id: "14",
    slug: "go-green-pelajar-nu-tanam-1000-pohon",
    title: "Go Green: Pelajar NU Bekasi Tanam 1.000 Pohon di Bantaran Kali Bekasi",
    excerpt:
      "Aksi peduli lingkungan ini menjadi bentuk komitmen pelajar NU dalam menjaga kelestarian alam Bekasi.",
    content: [
      "BEKASI — Sebanyak 500 pelajar NU dari berbagai PAC se-Kota Bekasi menanam 1.000 pohon mangrove dan trembesi di sepanjang bantaran Kali Bekasi.",
      "Kegiatan ini bekerjasama dengan Dinas Lingkungan Hidup Kota Bekasi sebagai bagian dari program Bekasi Hijau 2030.",
      "Ketua PC IPNU Bekasi menegaskan bahwa menjaga lingkungan adalah bagian dari ajaran Aswaja.",
    ],
    image: n12,
    category: "Kegiatan IPNU",
    author: "Departemen Lingkungan",
    date: "25 Maret 2026",
    readTime: 3,
    views: 1120,
    tags: ["Lingkungan", "Go Green", "Tanam Pohon", "Aswaja"],
  },
  {
    id: "15",
    slug: "opini-pelajar-nu-dan-moderasi-beragama",
    title: "Opini: Pelajar NU sebagai Garda Depan Moderasi Beragama",
    excerpt:
      "Refleksi tentang peran strategis pelajar Nahdlatul Ulama dalam menyebarkan nilai Islam Wasathiyah di Indonesia.",
    content: [
      "Moderasi beragama bukan sekadar jargon, melainkan keniscayaan di tengah keberagaman Indonesia. Pelajar NU memikul tanggung jawab besar untuk menjaganya.",
      "Tradisi Aswaja yang dianut NU mengajarkan tawassuth (tengah), tawazun (seimbang), dan tasamuh (toleran). Tiga nilai inilah yang menjadi modal utama pelajar NU.",
      "Di era digital, pelajar NU dituntut tidak hanya hadir di mimbar pengajian, tetapi juga di linimasa media sosial sebagai counter-narasi terhadap ekstremisme.",
    ],
    image: n7,
    category: "Opini",
    author: "Ust. Hamzah Mustofa",
    date: "23 Maret 2026",
    readTime: 6,
    views: 1670,
    tags: ["Opini", "Moderasi", "Aswaja", "Wasathiyah"],
  },
  {
    id: "16",
    slug: "pelatihan-jurnalistik-pelajar-nu-bekasi",
    title: "PC IPNU Bekasi Gelar Pelatihan Jurnalistik untuk Kader Media",
    excerpt:
      "Pelatihan dua hari ini melibatkan 50 kader yang akan menjadi tim media resmi IPNU IPPNU Kota Bekasi.",
    content: [
      "BEKASI — Departemen Media dan Informasi PC IPNU Kota Bekasi menggelar pelatihan jurnalistik dasar selama dua hari di Gedung NU Bekasi.",
      "Pemateri dihadirkan dari NU Online dan beberapa media nasional untuk memberikan workshop penulisan berita, fotografi, dan videografi.",
      "Para peserta nantinya akan tergabung dalam Tim Media PC IPNU IPPNU yang bertugas memproduksi konten berita harian.",
    ],
    image: n11,
    category: "Kegiatan IPNU",
    author: "Tim Media",
    date: "20 Maret 2026",
    readTime: 3,
    views: 540,
    tags: ["Jurnalistik", "Pelatihan", "Media", "Kader"],
  },
  {
    id: "17",
    slug: "bekasi-perkuat-pendidikan-karakter-pelajar",
    title: "Pemkot Bekasi Perkuat Pendidikan Karakter Pelajar Lewat Kerjasama dengan IPNU IPPNU",
    excerpt:
      "Kolaborasi ini akan menyasar 200 sekolah menengah di Kota Bekasi dengan program mentoring berkelanjutan.",
    content: [
      "BEKASI — Pemerintah Kota Bekasi resmi menjalin kerjasama dengan PC IPNU IPPNU untuk program penguatan pendidikan karakter di sekolah-sekolah menengah.",
      "Program ini akan menyasar 200 SMP/SMA/SMK di Kota Bekasi dengan kegiatan mentoring spiritual, anti-bullying, dan literasi keagamaan.",
      "MoU ditandatangani langsung oleh Wali Kota Bekasi dan Ketua PC IPNU di Balai Kota.",
    ],
    image: n2,
    category: "Bekasi Update",
    author: "Humas Pemkot",
    date: "18 Maret 2026",
    readTime: 3,
    views: 890,
    tags: ["Pendidikan", "Karakter", "Pemkot", "Kerjasama"],
  },
];

export const getArticleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const getRelatedArticles = (article: Article, limit = 3) =>
  articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, limit);

export const getArticlesByCategory = (category: string) =>
  articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());

export const getPopularArticles = (limit = 5) =>
  [...articles].sort((a, b) => b.views - a.views).slice(0, limit);

export const getTrendingTags = () => {
  const counts = new Map<string, number>();
  articles.forEach((a) => a.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
};
