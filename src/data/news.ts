import hero from "@/assets/hero-news.jpg";
import n1 from "@/assets/news-1.jpg";
import n2 from "@/assets/news-2.jpg";
import n3 from "@/assets/news-3.jpg";
import n4 from "@/assets/news-4.jpg";
import n5 from "@/assets/news-5.jpg";
import n6 from "@/assets/news-6.jpg";

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
