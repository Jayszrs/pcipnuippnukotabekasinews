import { Logo } from "./Logo";
import { Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { categories } from "@/data/news";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary-deep text-primary-foreground mt-16">
      <div className="container-news py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Portal berita resmi Pimpinan Cabang IPNU IPPNU Kota Bekasi. Mengabarkan kegiatan, opini, dan informasi pelajar Nahdlatul Ulama.
            </p>
            <div className="mt-5 flex gap-2">
              {/* Instagram dengan link profil */}
              <a 
                href="https://www.instagram.com/ipnukotabekasi/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-9 w-9 rounded-sm bg-white/10 hover:bg-gold hover:text-gold-foreground flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              {/* Youtube dibiarkan karena tidak disuruh hapus */}
              <a 
                href="#" 
                className="h-9 w-9 rounded-sm bg-white/10 hover:bg-gold hover:text-gold-foreground flex items-center justify-center transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-brand font-extrabold text-sm uppercase tracking-wider text-gold">Kategori</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/kategori/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="text-primary-foreground/75 hover:text-gold transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-brand font-extrabold text-sm uppercase tracking-wider text-gold">Tentang</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
              <li><Link to="/tentang-kami" className="hover:text-gold transition-colors">Tentang Kami</Link></li>
              <li><Link to="/redaksi" className="hover:text-gold transition-colors">Redaksi</Link></li>
              <li><Link to="/kontak" className="hover:text-gold transition-colors">Kontak</Link></li>
              <li><Link to="/admin" className="hover:text-gold transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-brand font-extrabold text-sm uppercase tracking-wider text-gold">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <a 
                  href="https://maps.app.goo.gl/Tf42hHrQvgE1tLHX9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors text-left"
                >
                  Gedung NU Centre yang ada di rawalumbu kota bekasi
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a 
                  href="mailto:lppipnuippnukotabekasi@gmail.com" 
                  className="hover:text-gold transition-colors"
                >
                  lppipnuippnukotabekasi@gmail.com
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a 
                  href="https://wa.me/62895330152658" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  0895330152658
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-news py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
          <p>© 2026 PC IPNU IPPNU Kota Bekasi. Hak Cipta Dilindungi.</p>
          <p>Belajar · Berjuang · Bertaqwa</p>
        </div>
      </div>
    </footer>
  );
};