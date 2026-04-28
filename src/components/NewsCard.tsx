import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import type { Article } from "@/data/news";
import { CategoryBadge } from "./CategoryBadge";

interface Props {
  article: Article;
  variant?: "default" | "horizontal" | "compact" | "overlay";
  priority?: boolean;
}

export const NewsCard = ({ article, variant = "default", priority }: Props) => {
  const link = `/berita/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link to={link} className="flex gap-3 group card-hover">
        <div className="w-24 h-20 shrink-0 overflow-hidden rounded-sm bg-muted">
          <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} />
          <h3 className="mt-1.5 font-brand font-bold text-sm leading-snug line-clamp-3 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link to={link} className="grid grid-cols-[40%_1fr] sm:grid-cols-[35%_1fr] gap-4 sm:gap-5 group card-hover">
        <div className="aspect-[4/3] overflow-hidden rounded-sm bg-muted">
          <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <CategoryBadge category={article.category} />
          <h3 className="mt-2 font-display font-bold text-lg sm:text-xl leading-tight line-clamp-3 group-hover:text-primary transition-colors text-balance">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 hidden sm:block">{article.excerpt}</p>
          <div className="mt-auto pt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{article.date}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "overlay") {
    return (
      <Link to={link} className="relative block aspect-[4/5] overflow-hidden rounded-sm group card-hover">
        <img
          src={article.image}
          alt={article.title}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-card-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <CategoryBadge category={article.category} />
          <h3 className="mt-2 font-display font-bold text-xl leading-tight line-clamp-3 text-balance">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-xs opacity-90">
            <span>{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={link} className="group card-hover flex flex-col">
      <div className="aspect-[16/10] overflow-hidden rounded-sm bg-muted">
        <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="pt-3 flex flex-col flex-1">
        <CategoryBadge category={article.category} />
        <h3 className="mt-2 font-display font-bold text-lg leading-snug line-clamp-3 group-hover:text-primary transition-colors text-balance">
          {article.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
        <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border mt-3">
          <span className="font-medium">{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
};
