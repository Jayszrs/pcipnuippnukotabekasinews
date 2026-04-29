import { BookOpen, Flag, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TentangKami = () => {
  const navigate = useNavigate();

  return (
    <div className="container-news py-10 min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Back */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-colors mb-6 font-semibold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <h1 className="text-4xl md:text-5xl font-display font-black text-primary mb-6 border-l-4 border-gold pl-4">
          Tentang PC IPNU IPPNU Kota Bekasi
        </h1>
        
        <div className="aspect-video w-full rounded-xl overflow-hidden mb-10 shadow-lg relative group">
          <img 
            src="https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&q=80" 
            alt="Kegiatan IPNU IPPNU" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-bold tracking-widest uppercase">Belajar, Berjuang, Bertaqwa</h2>
          </div>
        </div>

        <div className="text-gray-700 space-y-6 text-lg">
          <p className="text-xl leading-relaxed font-medium">
            Ikatan Pelajar Nahdlatul Ulama (IPNU) dan Ikatan Pelajar Putri Nahdlatul Ulama (IPPNU) Kota Bekasi adalah wadah perjuangan pelajar NU untuk mengamalkan Islam Ahlussunnah Wal Jama'ah An-Nahdliyah.
          </p>
          <p className="leading-relaxed">
            Media siber ini didirikan sebagai pusat informasi, dakwah digital, serta dokumentasi kegiatan pelajar NU di seluruh penjuru Kota Bekasi. Kami berkomitmen menyajikan berita yang aktual, faktual, dan mendidik.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 hover:shadow-lg transition">
            <BookOpen className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold text-xl mb-2">Belajar</h3>
            <p className="text-sm text-gray-600">Meningkatkan kapasitas keilmuan baik agama maupun umum bagi kader.</p>
          </div>
          <div className="bg-gold/10 p-6 rounded-xl border border-gold/20 hover:shadow-lg transition">
            <Flag className="h-10 w-10 text-gold mb-4" />
            <h3 className="font-bold text-xl mb-2">Berjuang</h3>
            <p className="text-sm text-gray-600">Bergerak di tengah masyarakat dan pelajar untuk menyebarkan nilai-nilai toleransi.</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 hover:shadow-lg transition">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold text-xl mb-2">Bertaqwa</h3>
            <p className="text-sm text-gray-600">Membentuk karakter kader yang religius dan menjunjung tinggi akhlakul karimah.</p>
          </div>
        </div>
      </div>
    </div>
  );
};