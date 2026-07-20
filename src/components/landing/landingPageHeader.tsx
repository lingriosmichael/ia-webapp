import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/languageSwitcher";

export function LandingPageHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-4">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-semibold tracking-[0.1em] text-primary"
      >
        <Sparkles className="h-4 w-4" />
        {t("common.brand")}
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
        <a href="#so-funktionierts" className="hover:text-foreground">
          {t("landing.header.navHowItWorks")}
        </a>
        <a href="#pilotprogramm" className="hover:text-foreground">
          {t("landing.header.navPilotProgram")}
        </a>
        <a href="#faq" className="hover:text-foreground">
          {t("landing.header.navFaq")}
        </a>
        <Link to="/ueber-uns" className="hover:text-foreground">
          {t("landing.header.navAboutUs")}
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          to="/login"
          className="inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {t("common.logIn")}
        </Link>
      </div>
    </header>
  );
}
