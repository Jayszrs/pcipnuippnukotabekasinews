## Rencana Optimasi Technical & Local SEO

Target keyword: "IPNU IPPNU Bekasi", "Pelajar NU Bekasi", "Berita Pelajar Bekasi", "Portal Berita PC IPNU IPPNU Kota Bekasi".

### 1. `public/sitemap.xml` (BUAT BARU)
Buat file fisik dengan 7 URL persis seperti spesifikasi user (Beranda, Tentang Kami, Struktural, Rating, Kontak, Redaksi, Media) dengan `lastmod=2026-05-10`, `changefreq` & `priority` sesuai brief.

### 2. `public/robots.txt` (UPDATE)
File sudah berisi konfigurasi yang nyaris identik. Akan disinkronkan persis dengan format brief (hapus komentar lama, struktur bersih, sitemap di akhir).

### 3. `src/pages/Article.tsx` — Dynamic Meta + JSON-LD
Implementasi tanpa menambah dependency baru (manipulasi DOM langsung di `useEffect`, bukan react-helmet — lebih ringan, tidak perlu install library):

- `document.title` = `"{article.title} — PC IPNU IPPNU Kota Bekasi"`
- Helper `upsertMeta(name|property, content)` untuk:
  - `meta[name="description"]` → potongan `article.excerpt` / strip HTML dari `content`, max 155 char
  - `meta[property="og:title"]`, `og:description`, `og:image` (= `article.banner_url` / `image`), `og:url` (= `window.location.href`), `og:type=article`
  - `meta[name="twitter:card"]=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- Inject `<script type="application/ld+json" id="article-jsonld">` dengan schema `NewsArticle`:
  ```
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.banner_url],
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt ?? article.publishedAt,
    "author": { "@type": "Person", "name": article.author ?? "LPP IPNU IPPNU Kota Bekasi" },
    "publisher": {
      "@type": "Organization",
      "name": "PC IPNU IPPNU Kota Bekasi",
      "logo": { "@type": "ImageObject", "url": "https://ipnuippnukotabekasinews.lovable.app/icon-web.ico" }
    },
    "mainEntityOfPage": window.location.href
  }
  ```
- Cleanup di return `useEffect`: hapus `#article-jsonld` & reset OG tags ke default supaya halaman lain tidak ter-pollute.

### 4. `src/pages/Index.tsx` — Meta Beranda
- `document.title` → `"IPNU IPPNU Kota Bekasi — Portal Berita Resmi Pelajar NU Bekasi"`
- Pakai helper `upsertMeta` yang sama (atau inline) untuk update `meta description` ke teks brief, plus OG title/description default.

### 5. ALT image SEO-friendly
- `src/pages/Index.tsx`: pastikan banner event `<img alt="Banner kegiatan PC IPNU IPPNU Kota Bekasi">`.
- `src/pages/TentangKami.tsx`: alt utama → `"Pengurus PC IPNU IPPNU Kota Bekasi"`.
- `src/pages/StructuralPage.tsx`: alt foto pengurus → `"Pengurus Struktural PC IPNU IPPNU Kota Bekasi - {nama}"` (jika ada list nama). Hanya menambahkan/menyempurnakan atribut `alt`, tanpa mengubah layout.

### Catatan teknis
- Tidak menginstall `react-helmet` (hindari risiko build & menjaga bundle ringan). Manipulasi DOM langsung sudah cukup karena Google merender JS.
- Tidak mengubah logic data, hanya presentasi & metadata → aman dari blank screen.
- Tidak menyentuh file backend / RLS / auth.

### File yang dibuat/diubah
- create `public/sitemap.xml`
- edit `public/robots.txt`
- edit `src/pages/Article.tsx`
- edit `src/pages/Index.tsx`
- edit `src/pages/TentangKami.tsx` (alt only)
- edit `src/pages/StructuralPage.tsx` (alt only)
