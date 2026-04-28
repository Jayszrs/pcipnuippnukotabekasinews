import { Play } from "lucide-react";
import { articles } from "@/data/news";

export const VideoHighlight = () => {
  const videos = articles.slice(0, 4);
  return (
    <section className="bg-foreground text-background py-14 lg:py-20">
      <div className="container-news">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              <span className="block h-[3px] w-8 bg-gold" />
              Highlight Video
            </span>
            <h2 className="mt-2 font-display font-black text-3xl lg:text-4xl">
              Tonton Liputan Terbaru
            </h2>
          </div>
          <a href="/media" className="hidden sm:inline-block text-sm font-bold text-gold hover:underline">
            Semua Video →
          </a>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <div className="relative aspect-video overflow-hidden rounded-sm group cursor-pointer">
            <img src={videos[0].image} alt={videos[0].title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-gold/95 flex items-center justify-center shadow-gold transition-transform group-hover:scale-110">
                <Play className="h-8 w-8 text-gold-foreground fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Video Utama · 12:34</span>
              <h3 className="mt-2 font-display font-bold text-2xl lg:text-3xl text-white text-balance line-clamp-2">
                {videos[0].title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {videos.slice(1, 4).map((v) => (
              <div key={v.id} className="relative aspect-video lg:aspect-[16/9] overflow-hidden rounded-sm group cursor-pointer">
                <img src={v.image} alt={v.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">04:21</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-foreground fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white text-sm font-bold line-clamp-2 leading-snug">{v.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
