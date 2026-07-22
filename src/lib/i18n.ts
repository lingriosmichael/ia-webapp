import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "@/locales/de";
import en from "@/locales/en";

export const LANGUAGE_STORAGE_KEY = "impact-atlas-language";
export const SUPPORTED_LANGUAGES = ["de", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: AppLanguage = "de";

function normalizeLanguage(language: string | null | undefined): AppLanguage {
  if (!language) return DEFAULT_LANGUAGE;
  const shortLanguage = language.toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(shortLanguage as AppLanguage)
    ? (shortLanguage as AppLanguage)
    : DEFAULT_LANGUAGE;
}

function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

export function persistLanguage(language: AppLanguage) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

export function setDocumentLanguage(language: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = normalizeLanguage(language);
  }
}

export async function hydrateStoredLanguage() {
  const storedLanguage = getStoredLanguage();
  if (storedLanguage !== normalizeLanguage(i18n.language)) {
    await i18n.changeLanguage(storedLanguage);
  }
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });

  setDocumentLanguage(DEFAULT_LANGUAGE);
  i18n.on("languageChanged", (language) => {
    persistLanguage(normalizeLanguage(language));
    setDocumentLanguage(language);
  });
}

export default i18n;
