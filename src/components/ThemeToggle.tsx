import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${className}`}
      aria-label="Ganti tema tampilan"
      title={`Tema: ${theme === "system" ? "System" : isDark ? "Gelap" : "Terang"}`}
    >
      {!mounted ? (
        <Moon className="h-5 w-5" />
      ) : theme === "system" ? (
        <Monitor className="h-5 w-5 text-primary" />
      ) : isDark ? (
        <Sun className="h-5 w-5 text-gold" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};
