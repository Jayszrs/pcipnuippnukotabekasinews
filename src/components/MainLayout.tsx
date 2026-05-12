import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, MapPin, Mail, Phone, Globe } from "lucide-react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Navigasi menu utama
  const navItems = [
    { name: "BERANDA", path: "/" },
    { name: "KEGIATAN IPNU & IPPNU", path: "/kategori/kegiatan-ipnu-ippnu" },
    { name: "BEKASI UPDATE", path: "/bekasi-update" },
    { name: "NASIONAL", path: "/nasional" },
    { name: "OPINI", path: "/opini" },
    { name: "MEDIA", path: "/media" },
    { name: "STRUKTURAL", path: "/struktural" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      
      {/* ================= HEADER / NAVBAR SECTION ================= */}
      <header className="w-full z-50 shadow-sm">
        {/* Top Mini Bar (Hijau IPNU) */}
        <div className="bg-primary text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Sesuai screenshot tanggal saat ini */}
            <div>Rabu, 6 Mei 2026</div>
            <div className="flex gap-6 items-center">
              <Link to="/tentang-kami" className="hover:text-gold transition-colors">Tentang Kami</Link>
              <Link to="/redaksi" className="hover:text-gold transition-colors">Redaksi</Link>
              <Link to="/kontak" className="hover:text-gold transition-colors">Kontak</Link>
            </div>
          </div>
        </div>

        {/* Main Navbar Bar (Putih) */}
        <div className="bg-white border-b border-slate-100 py-4 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Logo & Brand Identitas */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex items-center gap-1">
                {/* Placeholder emblem logo kembar IPNU IPPNU */}
                <div className="h-10 w-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm">IPNU</div>
                <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm -ml-2">IPPNU</div>
              </div>
              <div>
                <h1 className="text-base font-black text-slate-800 leading-none uppercase tracking-tight">IPNU <span className="text-primary">—</span> IPPNU</h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Kota Bekasi</p>
              </div>
            </div>

            {/* Menu Navigasi Tengah */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all relative ${
                      isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-[-18px] left-4 right-4 h-1 bg-gold rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Akses Fitur Kanan */}
            <div className="flex items-center gap-4 text-slate-600">
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><Search className="h-5 w-5" /></button>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><Moon className="h-5 w-5" /></button>
            </div>

          </div>
        </div>
      </header>

      {/* ================= KONTEN HALAMAN UTAMA ================= */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ================= FOOTER SECTION ================= */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-4 border-t-4 border-primary mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-slate-800 pb-12">
          {/* Tentang PC */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold">NU</div>
              <h3 className="font-black uppercase tracking-wider text-base">PC IPNU IPPNU KOTA BEKASI</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wadah perjuangan pelajar, santri, dan mahasiswa Nahdlatul Ulama di Kota Bekasi untuk belajar, berjuang, dan bertaqwa.
            </p>
          </div>

          {/* Tautan Cepat */}
          <div className="space-y-4 md:pl-10">
            <h3 className="font-black uppercase tracking-widest text-xs text-gold">Tautan Aplikasi</h3>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-white transition-colors">Halaman Beranda</Link></li>
              <li><Link to="/struktural" className="hover:text-white transition-colors">Struktural Pengurus</Link></li>
              <li><Link to="/kontak" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Sekretariat */}
          <div className="space-y-4">
            <h3 className="font-black uppercase tracking-widest text-xs text-gold">Sekretariat</h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Gedung PCNU Kota Bekasi, Jl. Jend. Ahmad Yani, Kota Bekasi, West Java, Indonesia.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>pc@ipnuippnukotabekasi.or.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest gap-4">
          <div>© 2026 PC IPNU IPPNU KOTA BEKASI. ALL RIGHTS RESERVED.</div>
          <div className="text-slate-400">DESIGNED & DEVELOPED BY JAELANI SURYA</div>
        </div>
      </footer>

    </div>
  );
};
