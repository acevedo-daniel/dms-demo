import type { Locale } from "@/lib/i18n/types";

const practiceTimeZone = "America/Argentina/Buenos_Aires";

export function formatDemoDate(date: Date, locale: Locale = "es") {
  const formatted = new Intl.DateTimeFormat(
    locale === "en" ? "en-GB" : "es-AR",
    {
      day: "numeric",
      month: "long",
      timeZone: practiceTimeZone,
      weekday: "long",
      year: "numeric",
    },
  ).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatDemoTime(date: Date, locale: Locale = "es") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-AR", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: practiceTimeZone,
  }).format(date);
}
