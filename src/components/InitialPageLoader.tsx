import { useEffect, useState } from "react";
import logoIpnuIppnu from "@/assets/logo-ipnu-ippnu.png";

export const InitialPageLoader = () => {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), 3300);
    const removeTimer = window.setTimeout(() => setVisible(false), 4100);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`initial-loader fixed inset-0 z-[9999] flex items-center justify-center text-primary-foreground ${
        leaving ? "is-leaving" : ""
      }`}
      role="status"
      aria-label="Memuat portal PC IPNU IPPNU Kota Bekasi"
    >
      <div className="initial-loader-grid" aria-hidden="true" />
      <div className="initial-loader-glow initial-loader-glow-a" aria-hidden="true" />
      <div className="initial-loader-glow initial-loader-glow-b" aria-hidden="true" />

      <div className="initial-loader-content">
        <div className="initial-loader-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="initial-loader-logo-card">
          <img src={logoIpnuIppnu} alt="Logo IPNU IPPNU" className="initial-loader-logo" />
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-gold">Portal Berita Resmi</p>
          <h1 className="mt-2 font-brand text-xl font-black uppercase tracking-[0.18em] sm:text-2xl">
            PC IPNU IPPNU Kota Bekasi
          </h1>
        </div>

        <div className="initial-loader-progress mt-8" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
};
