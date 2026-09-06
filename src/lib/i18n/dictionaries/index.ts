import { esDictionary } from "./es";
import { enDictionary } from "./en";
import type { Dictionary, Locale } from "../types";

export const dictionaries: Record<Locale, Dictionary> = {
  es: esDictionary,
  en: enDictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.es;
}
