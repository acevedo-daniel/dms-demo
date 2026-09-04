"use client";

import { useSyncExternalStore, useState } from "react";
import { Globe, Moon, Sun } from "lucide-react";

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

function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getLocaleSnapshot(): "en" | "es" {
  try {
    const saved = localStorage.getItem("dms-locale");
    return saved === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

function getServerLocaleSnapshot(): "en" | "es" {
  return "en";
}

export function StudioControls({ className = "" }: StudioControlsProps) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const savedLocale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  const [activeLocale, setActiveLocale] = useState<"en" | "es">(savedLocale);
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

  const selectLocale = (selectedLocale: "en" | "es") => {
    setActiveLocale(selectedLocale);
    try {
      localStorage.setItem("dms-locale", selectedLocale);
    } catch {
      // Ignore storage errors
    }

    if (selectedLocale === "es") {
      setNotice("Español seleccionado · Próximamente en v1.1");
      setTimeout(() => setNotice(null), 3000);
    } else {
      setNotice(null);
    }
  };

  const currentLocale = activeLocale || savedLocale;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Studio Capsule */}
      <div className="flex h-8 items-center gap-1 rounded-full border border-border/80 bg-surface/90 p-0.5 shadow-2xs backdrop-blur-xs transition-colors">
        {/* Language Segmented Switch */}
        <div
          aria-label="Language selection"
          className="flex items-center rounded-full bg-secondary/50 p-0.5"
          role="group"
        >
          <button
            aria-label="English language"
            aria-pressed={currentLocale === "en"}
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider transition-all ${
              currentLocale === "en"
                ? "bg-surface text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => selectLocale("en")}
            type="button"
          >
            EN
          </button>
          <button
            aria-label="Spanish language"
            aria-pressed={currentLocale === "es"}
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider transition-all ${
              currentLocale === "es"
                ? "bg-surface text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => selectLocale("es")}
            type="button"
          >
            ES
          </button>
        </div>

        <span aria-hidden="true" className="h-3.5 w-px bg-border/80" />

        {/* Dark Mode Toggle */}
        <button
          aria-label={
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          onClick={toggleTheme}
          title={
            theme === "light" ? "Activate Dark Mode" : "Activate Light Mode"
          }
          type="button"
        >
          {theme === "light" ? (
            <Moon aria-hidden="true" className="size-3.5" />
          ) : (
            <Sun aria-hidden="true" className="size-3.5 text-accent" />
          )}
        </button>
      </div>

      {/* Ephemeral Feedback Pill */}
      {notice && (
        <div
          aria-live="polite"
          className="absolute -bottom-9 right-0 z-50 whitespace-nowrap rounded-md border border-border/90 bg-surface px-2.5 py-1 font-mono text-[10px] font-medium text-foreground shadow-sm animate-in fade-in slide-in-from-top-1"
        >
          <span className="flex items-center gap-1.5">
            <Globe aria-hidden="true" className="size-3 text-accent" />
            {notice}
          </span>
        </div>
      )}
    </div>
  );
}
