import React from "react";
import { MapPin, Phone, Mail, Instagram, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Kontak = () => {
  const navigate = useNavigate();

  return (
    <div className="container-news py-10 min-h-screen animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:text-gold transition-colors mb-6 font-semibold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <h1 className="text-4xl font-display font-black text-primary mb-8 text-center">Hubungi Kami</h1>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sekretariat</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Jl. Veteran, RT.005/RW.003, Marga Jaya, Kec. Bekasi Sel., Kota Bks, Jawa Barat 17141
                </p>
              </div>
            </div>

            <a href="https://wa.me/62895330152658" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-green-500 group transition">
              <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-500 group-hover:text-white transition">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-green-600 transition">WhatsApp Admin</h3>
                <p className="text-gray-600 text-sm mt-1">0895330152658 (Respon Cepat)</p>
              </div>
            </a>

            <a href="https://www.instagram.com/ipnukotabekasi/" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-pink-500 group transition">
              <div className="bg-pink-100 p-3 rounded-full text-pink-600 group-hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 group-hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-pink-600 transition">Instagram</h3>
                <p className="text-gray-600 text-sm mt-1">@ipnukotabekasi</p>
              </div>
            </a>
          </div>

          <div className="bg-gray-100 rounded-2xl overflow-hidden min-h-[400px] border border-gray-200 shadow-inner">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.113264663969!2d106.996709574488!3d-6.248805361184852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698e7215787799%3A0x727439163b23eefe!2sJl.%20Veteran%2C%20Marga%20Jaya%2C%20Kec.%20Bekasi%20Sel.%2C%20Kota%20Bks%2C%20Jawa%20Barat%2017141!5e0!3m2!1sid!2sid!4v1714400000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Sekretariat"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};