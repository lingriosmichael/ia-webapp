import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { AppLanguage } from "@/lib/i18n";

const LANGUAGE_LABEL_KEYS: Record<AppLanguage, "german" | "english"> = {
  de: "german",
  en: "english",
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const resolvedLanguage = (i18n.resolvedLanguage ?? i18n.language)
    .toLowerCase()
    .slice(0, 2) as AppLanguage;
  const activeLanguage = SUPPORTED_LANGUAGES.includes(resolvedLanguage)
    ? resolvedLanguage
    : "de";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-[var(--shadow-soft)]",
        className,
      )}
      aria-label={t("language.switcherLabel")}
      role="group"
    >
      <span
        className="grid h-7 w-7 place-items-center text-muted-foreground"
        aria-hidden="true"
      >
        <Languages className="h-3.5 w-3.5" />
      </span>
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = language === activeLanguage;
        return (
          <button
            key={language}
            type="button"
            onClick={() => void i18n.changeLanguage(language)}
            className={cn(
              "rounded px-2.5 py-1 text-[11px] font-semibold transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-pressed={isActive}
          >
            {t(`language.${LANGUAGE_LABEL_KEYS[language]}`)}
          </button>
        );
      })}
    </div>
  );
}
