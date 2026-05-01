import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, X, Calendar, Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";

// Navigasi Utama - Ditambahkan "Struktural"
const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Kegiatan IPNU", to: "/kategori/kegiatan-ipnu" },
  { label: "Bekasi Update", to: "/kategori/bekasi-update" },
  { label: "Nasional", to: "/kategori/nasional" },
  { label: "Opini", to: "/kategori/opini" },
  { label: "Media", to: "/media" },
  { label: "Struktural", to: "/struktural" }, // <-- Menu Baru Berhasil Ditambahkan
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Logic Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // Format Tanggal Hari Ini
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300">
      
      {/* 1. TOP UTILITY BAR (Desktop Only) */}
      <div className="hidden md:block bg-primary-deep text-primary-foreground text-[10px] font-black uppercase tracking-widest">
        <div className="container-news flex items-center justify-between h-10">
          <div className="flex items-center gap-2 opacity-90">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span className="capitalize">{today}</span>
          </div>
          <div className="flex items-center gap-6 opacity-90">
            <Link to="/tentang-kami" className="hover:text-gold transition-colors">Tentang Kami</Link>
            <Link to="/redaksi" className="hover:text-gold transition-colors">Redaksi</Link>
            <Link to="/kontak" className="hover:text-gold transition-colors">Kontak</Link>
            <Link to="/admin" className="px-3 py-1 bg-gold text-primary-deep rounded-sm font-black hover:bg-white transition-all">
              ADMIN LOGIN
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
              className={({ isActive }) =>
                `relative px-3 py-2 text-[11px] font-black font-brand uppercase tracking-wider transition-all duration-300 ${
                  isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
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
            className="p-2.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Cari"
          >
            <Search className="h-5 w-5 text-foreground" />
          </button>
          
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5 text-foreground" />}
          </button>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE NAVIGATION MENU */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
          <nav className="container-news py-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-4 rounded-xl text-sm font-black font-brand uppercase tracking-widest transition-all ${
                    isActive ? "bg-primary text-white shadow-lg" : "hover:bg-muted"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {/* Quick Links Mobile */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
              <Link to="/tentang-kami" onClick={() => setOpen(false)} className="text-[10px] font-black uppercase p-3 bg-muted rounded-lg text-center">Tentang</Link>
              <Link to="/kontak" onClick={() => setOpen(false)} className="text-[10px] font-black uppercase p-3 bg-muted rounded-lg text-center">Kontak</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};