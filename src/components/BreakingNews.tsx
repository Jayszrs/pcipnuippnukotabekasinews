import { Zap } from "lucide-react";
import { useArticles } from "@/contexts/ArticlesContext";

export const BreakingNews = () => {
  const { articles } = useArticles();
  const items = articles.slice(0, 6).map((a) => a.title);
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div className="bg-foreground text-background border-y border-border">
      <div className="container-news flex items-center h-11 gap-4 overflow-hidden">
        <div className="flex items-center gap-2 bg-breaking text-breaking-foreground px-3 py-1 rounded-sm shrink-0 font-brand font-bold text-xs uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5 fill-current" />
          Breaking
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex gap-12 animate-ticker whitespace-nowrap">
            {doubled.map((t, i) => (
              <span key={i} className="text-sm font-medium">
                <span className="text-gold mr-3">●</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
