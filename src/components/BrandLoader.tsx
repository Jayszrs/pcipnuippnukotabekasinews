import { useEffect, useState } from "react";
import logoIpnuIppnu from "@/assets/logo-ipnu-ippnu.png";

export const BrandLoader = () => {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), 1750);
    const doneTimer = window.setTimeout(() => setVisible(false), 2550);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`brand-loader fixed inset-0 z-[9999] flex items-center justify-center bg-primary-deep text-primary-foreground ${
        leaving ? "is-leaving" : ""
      }`}
      role="status"
      aria-label="Memuat website PC IPNU IPPNU Kota Bekasi"
    >
      <div className="brand-loader-grid" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="brand-loader-mark">
          <div className="brand-loader-ring" aria-hidden="true" />
          <div className="brand-loader-shape">
            <img src={logoIpnuIppnu} alt="" className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="mt-7 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-gold">PC IPNU IPPNU</p>
          <h1 className="font-brand text-lg font-black uppercase tracking-[0.16em] sm:text-xl">Kota Bekasi</h1>
        </div>

        <div className="brand-loader-progress mt-7" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
};
