import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Redaksi = () => {
  const navigate = useNavigate();
  const redaksiTeam = [
    { role: "Pelindung", name: "Ketua PCNU Kota Bekasi" },
    { role: "Penasihat", name: "Ketua PC IPNU & IPPNU Kota Bekasi" },
    { role: "Pemimpin Redaksi", name: "Jaelani Surya Saputra" },
    { role: "Editor in Chief", name: "Tim Lembaga Pers & Penerbitan" },
    { role: "Reporter / Content Creator", name: "Kader IPNU IPPNU Kota Bekasi" },
  ];

  return (
    <div className="container-news py-10 min-h-screen animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto text-center">
        {/* Tombol Back */}
        <div className="flex justify-start">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-primary hover:text-gold transition-colors mb-6 font-semibold group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black text-primary mb-4 text-balance">
          Susunan Redaksi
        </h1>
        <p className="text-gray-600 mb-12">Orang-orang di balik layar Portal Berita Pelajar NU Kota Bekasi.</p>
        
        <div className="space-y-4 text-left">
          {redaksiTeam.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:border-gold hover:shadow-md transition-all">
              <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-2 md:mb-0">
                {item.role}
              </span>
              <span className="text-lg font-medium text-gray-800">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};