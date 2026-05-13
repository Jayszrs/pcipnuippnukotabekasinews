import { Play, ExternalLink } from "lucide-react";
import { useArticles, type ArticleWithVideo } from "@/contexts/ArticlesContext";
import { Link } from "react-router-dom";

// Detect external embed URLs (TikTok, YouTube, Instagram, etc.)
const isDirectVideoFile = (url: string) =>
  /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

const getYoutubeEmbed = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

const VideoPlayer = ({ video }: { video: ArticleWithVideo }) => {
  const url = video.videoUrl!;
  if (isDirectVideoFile(url)) {
    return <video src={url} controls className="w-full h-full object-cover bg-black" />;
  }
  const yt = getYoutubeEmbed(url);
  if (yt) {
    return <iframe src={yt} title={video.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  }
  // Fallback: external link card
  return (
    <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
      <ExternalLink className="h-10 w-10 mb-3" />
      <span className="text-sm font-bold">Buka video di tab baru</span>
    </a>
  );
};

export const VideoHighlight = () => {
  const { getVideos, articles } = useArticles();
  const videos = getVideos();
  if (videos.length === 0) return null; // hide section when no videos uploaded

  const main = videos[0];
  const others = videos.slice(1, 4);
  const fillers = others.length < 3 ? articles.slice(0, 3 - others.length) : [];

  return (
    <section className="relative overflow-hidden bg-[#06140c] text-white py-14 lg:py-20 dark:bg-[#020806]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)_/_0.32),transparent_34rem),linear-gradient(135deg,hsl(var(--primary-deep)_/_0.92),transparent_52%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gold/60" />
      <div className="container-news">
        <div className="relative flex items-end justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              <span className="block h-[3px] w-8 bg-gold" />
              Highlight Video
            </span>
            <h2 className="mt-2 font-display font-black text-3xl lg:text-4xl">
              Tonton Liputan Terbaru
            </h2>
          </div>
          <Link to="/media" className="hidden sm:inline-block text-sm font-bold text-gold hover:underline">
            Semua Video →
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <div className="relative aspect-video overflow-hidden rounded-sm bg-black shadow-2xl shadow-black/35 ring-1 ring-white/10">
            <VideoPlayer video={main} />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Video Utama</span>
              <h3 className="mt-2 font-display font-bold text-2xl lg:text-3xl text-white text-balance line-clamp-2">
                {main.title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {others.map((v) => (
              <Link key={v.id} to={`/berita/${v.slug}`} className="relative aspect-video lg:aspect-[16/9] overflow-hidden rounded-sm group cursor-pointer shadow-xl shadow-black/20 ring-1 ring-white/10">
                <img src={v.image} alt={v.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/75 group-hover:via-black/25 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/92 flex items-center justify-center shadow-lg shadow-black/25 ring-1 ring-white/40">
                    <Play className="h-5 w-5 text-primary-deep fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white text-sm font-bold line-clamp-2 leading-snug">{v.title}</h4>
                </div>
              </Link>
            ))}
            {fillers.map((v) => (
              <Link key={v.id} to={`/berita/${v.slug}`} className="relative aspect-video lg:aspect-[16/9] overflow-hidden rounded-sm group cursor-pointer shadow-xl shadow-black/20 ring-1 ring-white/10">
                <img src={v.image} alt={v.title} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white text-sm font-bold line-clamp-2 leading-snug">{v.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
