import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, X, Calendar, Moon, Sun } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/news";

const navItems = [
  { label: "Beranda", to: "/" },
  ...categories.map((c) => ({
    label: c,
    to: `/kategori/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, "-"))}`,
  })),
  { label: "Media", to: "/media" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top utility bar */}
      <div className="hidden md:block bg-primary-deep text-primary-foreground text-xs">
        <div className="container-news flex items-center justify-between h-9">
          <div className="flex items-center gap-2 opacity-90">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span className="capitalize">{today}</span>
          </div>
          <div className="flex items-center gap-5 opacity-90">
            {/* PERBAIKAN: Ganti <a> jadi <Link> dan arahkan ke path yang benar */}
            <Link to="/tentang-kami" className="hover:text-gold transition-colors">Tentang Kami</Link>
            <Link to="/redaksi" className="hover:text-gold transition-colors">Redaksi</Link>
            <Link to="/kontak" className="hover:text-gold transition-colors">Kontak</Link>
            <Link to="/admin" className="hover:text-gold transition-colors font-semibold">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-news flex items-center justify-between h-16 lg:h-20 gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-semibold font-brand transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[22px] left-3 right-3 h-[3px] bg-gold" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Cari"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-border bg-background">
          <div className="container-news py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                placeholder="Cari berita, kategori, tag..."
                className="w-full pl-12 pr-4 py-3 rounded-md bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-news py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-md text-sm font-semibold font-brand transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {/* Mobile links juga perlu diperhatikan */}
            <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-border">
              <Link to="/tentang-kami" onClick={() => setOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-md">Tentang Kami</Link>
              <Link to="/redaksi" onClick={() => setOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-md">Redaksi</Link>
              <Link to="/kontak" onClick={() => setOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-md">Kontak</Link>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-2 px-3 py-3 rounded-md bg-gold text-gold-foreground font-bold text-sm text-center"
              >
                Admin Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};