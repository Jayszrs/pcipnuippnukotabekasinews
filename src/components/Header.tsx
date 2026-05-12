import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, X, Calendar, Star } from "lucide-react"; // <-- IMPORT STAR DI SINI
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

// Navigasi Utama - Ditambahkan "Struktural" & "Rating Layanan" dengan Flag Spesial
const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Kegiatan IPNU & IPPNU", to: "/kategori/kegiatan-ipnu-ippnu" },
  { label: "Bekasi Update", to: "/kategori/bekasi-update" },
  { label: "Nasional", to: "/kategori/nasional" },
  { label: "Opini", to: "/kategori/opini" },
  { label: "Media", to: "/media" },
  { label: "Struktural", to: "/struktural" }, 
  { label: "Rating Layanan", to: "/rating", isSpecial: true }, // <-- Menu Baru Rating Layanan
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Format Tanggal Hari Ini
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 shadow-sm shadow-black/5 backdrop-blur-xl transition-colors duration-300 dark:bg-background/85 dark:shadow-black/30">
      
      {/* 1. TOP UTILITY BAR (Desktop Only) */}
      <div className="hidden md:block bg-primary-deep text-primary-foreground text-[10px] font-black uppercase tracking-widest dark:bg-card">
        <div className="container-news flex items-center justify-between h-10">
          <div className="flex items-center gap-2 opacity-90">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span className="capitalize">{today}</span>
          </div>
          <div className="flex items-center gap-6 opacity-90">
            <Link to="/tentang-kami" data-nav-loader-label="Tentang Kami" className="hover:text-gold transition-colors">Tentang Kami</Link>
            <Link to="/redaksi" data-nav-loader-label="Redaksi" className="hover:text-gold transition-colors">Redaksi</Link>
            <Link to="/kontak" data-nav-loader-label="Kontak" className="hover:text-gold transition-colors">Kontak</Link>
            
            {/* Quick Link Rating Emas di Bar Atas */}
            <Link to="/rating" data-nav-loader-label="Rating Layanan" className="hover:text-gold text-gold font-bold flex items-center gap-1 transition-colors">
              Rating <Star className="h-3 w-3 fill-gold text-gold" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="container-news flex items-center justify-between h-16 lg:h-20 gap-4">
        <Logo />

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-nav-loader-label={item.label}
              className={({ isActive }) =>
                `relative px-3 py-2 text-[11px] font-black font-brand uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  
                  {/* Icon Bintang Kedip Khusus Menu Rating */}
                  {item.isSpecial && (
                    <Star className="h-3.5 w-3.5 fill-gold text-gold animate-pulse shrink-0" />
                  )}

                  {/* Underline Indicator untuk menu yang aktif */}
                  {isActive && (
                    <span className="absolute -bottom-[26px] lg:-bottom-[30px] left-3 right-3 h-[3px] bg-gold rounded-t-full animate-in fade-in slide-in-from-bottom-2" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Icon Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2.5 rounded-full border border-transparent hover:border-border hover:bg-muted transition-colors"
            aria-label="Cari"
          >
            <Search className="h-5 w-5 text-foreground" />
          </button>
          
          <ThemeToggle />

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2.5 rounded-full border border-transparent hover:border-border hover:bg-muted transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE NAVIGATION MENU */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/98 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40">
          <nav className="container-news py-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                data-nav-loader-label={item.label}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-4 rounded-xl text-sm font-black font-brand uppercase tracking-widest transition-all flex items-center justify-between ${
                    isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {item.isSpecial && (
                      <Star className={`h-4 w-4 fill-gold text-gold ${isActive ? "" : "animate-pulse"}`} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            
            {/* Quick Links Mobile (Diubah Jadi 3 Kolom yang Rapi & Seimbang) */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
              <Link to="/tentang-kami" data-nav-loader-label="Tentang Kami" onClick={() => setOpen(false)} className="text-[10px] font-black uppercase p-3 bg-muted rounded-lg text-center">Tentang</Link>
              <Link to="/kontak" data-nav-loader-label="Kontak" onClick={() => setOpen(false)} className="text-[10px] font-black uppercase p-3 bg-muted rounded-lg text-center">Kontak</Link>
              <Link 
                to="/rating" 
                data-nav-loader-label="Rating Layanan"
                onClick={() => setOpen(false)} 
                className="text-[10px] font-black uppercase p-3 bg-gold/10 text-gold border border-gold/20 rounded-lg text-center flex items-center justify-center gap-1"
              >
                Rating <Star className="h-3 w-3 fill-gold text-gold" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
