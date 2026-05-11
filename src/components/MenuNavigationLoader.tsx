import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type MenuLoaderState = {
  label: string;
  token: number;
  leaving: boolean;
};

const MIN_VISIBLE_MS = 950;
const SAME_ROUTE_VISIBLE_MS = 1350;
const EXIT_MS = 420;

export const MenuNavigationLoader = () => {
  const location = useLocation();
  const [loader, setLoader] = useState<MenuLoaderState | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const shownAtRef = useRef(0);
  const routeKeyRef = useRef(location.key);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const hideLoader = useCallback(() => {
    clearHideTimer();
    setLoader((current) => (current ? { ...current, leaving: true } : current));

    hideTimerRef.current = window.setTimeout(() => {
      setLoader(null);
      hideTimerRef.current = null;
    }, EXIT_MS);
  }, [clearHideTimer]);

  const scheduleHide = useCallback(
    (delay: number) => {
      clearHideTimer();
      hideTimerRef.current = window.setTimeout(hideLoader, delay);
    },
    [clearHideTimer, hideLoader],
  );

  const showLoader = useCallback(
    (label: string) => {
      clearHideTimer();
      shownAtRef.current = window.performance.now();
      setLoader({
        label,
        token: Date.now(),
        leaving: false,
      });
      scheduleHide(SAME_ROUTE_VISIBLE_MS);
    },
    [clearHideTimer, scheduleHide],
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[data-nav-loader-label]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const nextUrl = new URL(link.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;

      const label = link.dataset.navLoaderLabel || link.textContent?.trim() || "Memuat";
      showLoader(label);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [showLoader]);

  useEffect(() => {
    if (routeKeyRef.current === location.key) return;
    routeKeyRef.current = location.key;
    if (!loader) return;

    const elapsed = window.performance.now() - shownAtRef.current;
    scheduleHide(Math.max(360, MIN_VISIBLE_MS - elapsed));
  }, [loader, location.key, scheduleHide]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  if (!loader) return null;

  return (
    <div
      className={`menu-navigation-loader fixed inset-0 z-[9998] flex items-center justify-center text-primary-foreground ${
        loader.leaving ? "is-leaving" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={`Memuat halaman ${loader.label}`}
    >
      <div className="menu-navigation-loader-grid" aria-hidden="true" />
      <div className="menu-navigation-loader-spark menu-navigation-loader-spark-a" aria-hidden="true" />
      <div className="menu-navigation-loader-spark menu-navigation-loader-spark-b" aria-hidden="true" />

      <div className="menu-navigation-loader-panel" key={loader.token}>
        <div className="menu-navigation-loader-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="menu-navigation-loader-kicker">Memuat Menu</p>
        <h2 className="menu-navigation-loader-title">{loader.label}</h2>
        <p className="menu-navigation-loader-subtitle">Portal Berita IPNU IPPNU</p>
        <div className="menu-navigation-loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
};
