import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

type PublicPage = "landing" | "login" | "register";

export function PublicSiteHeader({ currentPage }: { currentPage: PublicPage }) {
  const { t } = useTranslation();
  const isLandingPage = currentPage === "landing";

  return (
    <header className="flex h-20 items-center justify-between gap-4 overflow-visible md:h-24">
      <BrandWordmark
        className="-ml-[3.2rem] h-full shrink-0"
        imageClassName="h-12 w-auto origin-left scale-[3.84] md:h-14"
        textClassName="text-sm tracking-[0.1em]"
      />

      {isLandingPage ? (
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#so-funktionierts" className="hover:text-foreground">
            {t("landing.header.navHowItWorks")}
          </a>
          <a href="#faq" className="hover:text-foreground">
            {t("landing.header.navFaq")}
          </a>
          <Link to="/ueber-uns" className="hover:text-foreground">
            {t("landing.header.navAboutUs")}
          </Link>
        </nav>
      ) : null}

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          to="/login"
          className={cn(
            "inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors",
            currentPage === "login"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent hover:text-accent-foreground",
          )}
          aria-current={currentPage === "login" ? "page" : undefined}
        >
          {t("common.logIn")}
        </Link>
        {isLandingPage ? null : (
          <Link
            to="/register"
            className={cn(
              "inline-flex h-9 items-center rounded-md px-4 text-sm font-medium shadow transition-colors",
              currentPage === "register"
                ? "bg-signal text-signal-foreground"
                : "bg-signal text-signal-foreground hover:bg-signal/94",
            )}
            aria-current={currentPage === "register" ? "page" : undefined}
          >
            {t("common.register")}
          </Link>
        )}
      </div>
    </header>
  );
}
