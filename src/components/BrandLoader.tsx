import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import logoIpnuIppnu from "@/assets/logo-ipnu-ippnu.png";

export const BrandLoader = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const firstRoute = useRef(true);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const showLoader = useCallback(() => {
    clearTimers();
    setVisible(true);
    setLeaving(false);
  }, [clearTimers]);

  const playLoader = useCallback(
    (holdMs = 1000) => {
      showLoader();
      timers.current = [
        window.setTimeout(() => setLeaving(true), holdMs),
        window.setTimeout(() => setVisible(false), holdMs + 1100),
      ];
    },
    [showLoader],
  );

  useEffect(() => {
    playLoader(2850);

    const handleBeforeUnload = () => {
      document.documentElement.classList.add("brand-page-exit");
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!target || target.target === "_blank" || target.hasAttribute("download")) return;

      const url = new URL(target.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const samePage = url.origin === currentUrl.origin && url.pathname === currentUrl.pathname && url.search === currentUrl.search;

      if (url.origin !== currentUrl.origin) {
        document.documentElement.classList.add("brand-page-exit");
        return;
      }

      if (!samePage) showLoader();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);

    return () => {
      clearTimers();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
      document.documentElement.classList.remove("brand-page-exit");
    };
  }, [clearTimers, playLoader, showLoader]);

  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }

    playLoader(1050);
  }, [location.key, playLoader]);

  return (
    <div
      className={`brand-loader fixed inset-0 z-[9999] flex items-center justify-center bg-primary-deep text-primary-foreground ${
        visible ? "" : "is-hidden"
      } ${leaving ? "is-leaving" : ""}`}
      aria-hidden={!visible}
      role="status"
      aria-label="Memuat website PC IPNU IPPNU Kota Bekasi"
    >
      <div className="brand-loader-grid" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="brand-loader-mark">
          <div className="brand-loader-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
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
