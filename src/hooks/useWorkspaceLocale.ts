import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import de from "@/locales/de";
import en from "@/locales/en";

export function useWorkspaceLocale() {
  const { i18n } = useTranslation();

  return useMemo(
    () => ((i18n.resolvedLanguage ?? i18n.language).startsWith("de") ? de : en),
    [i18n.language, i18n.resolvedLanguage],
  );
}
