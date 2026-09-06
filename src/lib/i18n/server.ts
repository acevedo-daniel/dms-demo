import { cookies } from "next/headers";
import { getDictionary } from "./dictionaries";
import { LOCALE_COOKIE_NAME, type Dictionary, type Locale } from "./types";

export { LOCALE_COOKIE_NAME };

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieLocale === "en" || cookieLocale === "es") {
      return cookieLocale;
    }
  } catch {
    // If called outside of request scope, fallback to default
  }
  return "es";
}

export async function getServerTranslations(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getServerLocale();
  return {
    locale,
    t: getDictionary(locale),
  };
}
