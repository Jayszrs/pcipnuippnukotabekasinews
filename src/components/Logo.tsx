import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-ipnu-ippnu.png";

export const Logo = ({ variant = "default", landing = false }: { variant?: "default" | "light"; landing?: boolean }) => {
  const isLight = variant === "light";
  return (
    <Link
      to="/"
      data-nav-loader-label="Beranda"
      className={`site-logo flex items-center gap-2.5 group shrink-0 ${landing ? "site-logo--landing" : ""}`}
      aria-label="IPNU IPPNU Kota Bekasi"
    >
      <img
        src={logoImg}
        alt="Logo IPNU IPPNU"
        width={96}
        height={48}
        className="h-10 sm:h-11 w-auto object-contain shrink-0"
      />
      <div className="leading-none hidden xs:block sm:block">
        <div
          className={`font-brand font-extrabold text-sm sm:text-base tracking-tight ${
            isLight ? "text-white" : "text-foreground"
          }`}
        >
          IPNU<span className="text-gold">·</span>IPPNU
        </div>
        <div
          className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] mt-0.5 ${
            isLight ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          Kota Bekasi
        </div>
      </div>
    </Link>
  );
};
