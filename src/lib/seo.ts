// Lightweight SEO helpers — manipulate <head> tags directly without extra deps.

type MetaKind = "name" | "property";

export function upsertMeta(kind: MetaKind, key: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(kind, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setCanonical(href: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function setJsonLd(id: string, data: Record<string, unknown>) {
  if (typeof document === "undefined") return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.text = JSON.stringify(data);
}

export function removeJsonLd(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.remove();
}

export function truncate(text: string, max = 155) {
  const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

export function applyDefaultMeta() {
  const title = "IPNU IPPNU Kota Bekasi — Portal Berita Resmi Pelajar NU Bekasi";
  const desc =
    "Portal berita resmi Pimpinan Cabang IPNU IPPNU Kota Bekasi. Menyajikan informasi kegiatan, opini, dan ruang literasi digital untuk pelajar NU se-Kota Bekasi.";
  const url = typeof window !== "undefined" ? window.location.origin + "/" : "";
  const img =
    "https://storage.googleapis.com/gpt-engineer-file-uploads/zL6Gvu2knSUTfdostHxZrEIx6L53/social-images/social-1778220015335-Gemini_Generated_Image_cne4dhcne4dhcne4.webp";
  document.title = title;
  upsertMeta("name", "description", desc);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", desc);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", img);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", desc);
  upsertMeta("name", "twitter:image", img);
}
