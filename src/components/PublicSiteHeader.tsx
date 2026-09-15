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
        className="h-full shrink-0"
        imageClassName="h-9 w-auto md:h-10"
        textClassName="text-sm tracking-[0.1em]"
      />

      {isLandingPage ? (
        // "landing" also covers /ueber-uns (same header treatment), where
        // #so-funktionierts and #faq don't exist in the DOM — so these use
        // TanStack Router's Link + hash rather than plain <a href="#...">,
        // which routes to "/" first when needed and then scrolls once the
        // target section is actually in the DOM.
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            to="/"
            hash="so-funktionierts"
            className="hover:text-foreground"
          >
            {t("landing.header.navHowItWorks")}
          </Link>
          <Link to="/" hash="faq" className="hover:text-foreground">
            {t("landing.header.navFaq")}
          </Link>
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
      </div>
    </header>
  );
}
