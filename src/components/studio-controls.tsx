"use client";

import { useSyncExternalStore, useState } from "react";
import { Globe, Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface StudioControlsProps {
  className?: string;
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
}

export function StudioControls({ className = "" }: StudioControlsProps) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const { locale, setLocale } = useI18n();
  const [notice, setNotice] = useState<string | null>(null);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("dms-theme", nextTheme);
    } catch {
      // Ignore storage errors
    }
  };

  const handleSelectLocale = (selectedLocale: "en" | "es") => {
    if (selectedLocale === locale) return;
    setLocale(selectedLocale);
    setNotice(selectedLocale === "en" ? "English active" : "Español activado");
    setTimeout(() => setNotice(null), 2500);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Studio Capsule */}
      <div className="flex h-8 items-center gap-1 rounded-full border border-border/80 bg-surface/90 p-0.5 shadow-2xs backdrop-blur-xs transition-colors">
        {/* Language Segmented Switch */}
        <div
          aria-label={
            locale === "es" ? "Selección de idioma" : "Language selection"
          }
          className="flex items-center rounded-full bg-secondary/50 p-0.5"
          role="group"
        >
          <button
            aria-label={locale === "es" ? "Idioma español" : "Spanish language"}
            aria-pressed={locale === "es"}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
              locale === "es"
                ? "bg-surface dark:bg-surface-raised text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="locale-es"
            onClick={() => handleSelectLocale("es")}
            type="button"
          >
            ES
          </button>
          <button
            aria-label={locale === "es" ? "Idioma inglés" : "English language"}
            aria-pressed={locale === "en"}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
              locale === "en"
                ? "bg-surface dark:bg-surface-raised text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="locale-en"
            onClick={() => handleSelectLocale("en")}
            type="button"
          >
            EN
          </button>
        </div>

        <span aria-hidden="true" className="h-3.5 w-px bg-border/80" />

        {/* Dark Mode Toggle */}
        <button
          aria-label={
            theme === "light"
              ? locale === "es"
                ? "Cambiar a modo oscuro"
                : "Switch to dark theme"
              : locale === "es"
                ? "Cambiar a modo claro"
                : "Switch to light theme"
          }
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          onClick={toggleTheme}
          title={
            theme === "light"
              ? locale === "es"
                ? "Activar modo oscuro"
                : "Activate Dark Mode"
              : locale === "es"
                ? "Activar modo claro"
                : "Activate Light Mode"
          }
          type="button"
        >
          {theme === "light" ? (
            <Moon aria-hidden="true" className="size-3.5" />
          ) : (
            <Sun aria-hidden="true" className="size-3.5 text-foreground/80" />
          )}
        </button>
      </div>

      {/* Ephemeral Feedback Pill */}
      {notice && (
        <div
          aria-live="polite"
          className="absolute -bottom-9 right-0 z-50 whitespace-nowrap rounded-full border border-border/80 bg-surface px-3 py-1 text-xs font-medium text-foreground shadow-sm animate-in fade-in slide-in-from-top-1"
        >
          <span className="flex items-center gap-1.5">
            <Globe
              aria-hidden="true"
              className="size-3 text-muted-foreground"
            />
            {notice}
          </span>
        </div>
      )}
    </div>
  );
}
