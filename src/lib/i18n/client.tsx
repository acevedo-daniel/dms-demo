"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getDictionary } from "./dictionaries";
import { LOCALE_COOKIE_NAME, type Dictionary, type Locale } from "./types";

interface I18nContextValue {
  isPending: boolean;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = "es",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [prevInitialLocale, setPrevInitialLocale] = useState(initialLocale);

  if (initialLocale !== prevInitialLocale) {
    setPrevInitialLocale(initialLocale);
    setLocaleState(initialLocale);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      document.documentElement.lang = nextLocale;

      try {
        localStorage.setItem("dms-locale", nextLocale);
        document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // Ignore storage errors
      }

      startTransition(() => {
        router.refresh();
      });
    },
    [router],
  );

  const t = useMemo(() => getDictionary(locale), [locale]);

  const value = useMemo(
    () => ({
      isPending,
      locale,
      setLocale,
      t,
    }),
    [isPending, locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback for isolated tests or unmounted trees
    const defaultLocale: Locale = "es";
    return {
      isPending: false,
      locale: defaultLocale,
      setLocale: () => {},
      t: getDictionary(defaultLocale),
    };
  }
  return context;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
