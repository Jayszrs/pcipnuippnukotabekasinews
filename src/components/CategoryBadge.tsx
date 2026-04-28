import { Link } from "react-router-dom";
import type { Category } from "@/data/news";

const colors: Record<Category, string> = {
  "Kegiatan IPNU": "bg-primary text-primary-foreground",
  "Kegiatan IPPNU": "bg-gold text-gold-foreground",
  "Bekasi Update": "bg-primary-deep text-primary-foreground",
  Nasional: "bg-foreground text-background",
  Opini: "bg-secondary text-primary border border-primary/20",
};

export const CategoryBadge = ({
  category,
  size = "sm",
}: {
  category: Category;
  size?: "sm" | "md";
}) => {
  const slug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"));
  return (
    <Link
      to={`/kategori/${slug}`}
      className={`inline-flex items-center font-brand font-bold uppercase tracking-wider transition-opacity hover:opacity-90 ${
        size === "sm" ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5"
      } ${colors[category]}`}
    >
      {category}
    </Link>
  );
};
