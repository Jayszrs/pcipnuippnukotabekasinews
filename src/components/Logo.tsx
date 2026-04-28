import { Link } from "react-router-dom";

export const Logo = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const isLight = variant === "light";
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="IPNU IPPNU Bekasi">
      <div className="relative">
        <div className="h-10 w-10 rounded-md gradient-primary flex items-center justify-center shadow-elevated">
          <span className="font-display font-black text-primary-foreground text-lg leading-none">
            ن
          </span>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-gold border-2 border-background" />
      </div>
      <div className="leading-none">
        <div className={`font-brand font-extrabold text-base tracking-tight ${isLight ? "text-white" : "text-foreground"}`}>
          IPNU<span className="text-gold">·</span>IPPNU
        </div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] mt-0.5 ${isLight ? "text-white/70" : "text-muted-foreground"}`}>
          Kota Bekasi
        </div>
      </div>
    </Link>
  );
};
