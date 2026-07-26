import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BrandWordmark } from "@/components/BrandWordmark";

export function LandingFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 flex flex-col gap-4 border-t border-border/70 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <BrandWordmark
          className="shrink-0"
          imageClassName="h-8"
          textClassName="font-semibold tracking-[0.12em] text-foreground"
        />
        <span className="text-muted-foreground">
          {t("landing.footer.tagline")}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link to="/impressum" className="hover:text-foreground">
          {t("landing.footer.impressum")}
        </Link>
        <Link to="/datenschutz" className="hover:text-foreground">
          {t("landing.footer.datenschutz")}
        </Link>
        <Link to="/agb" className="hover:text-foreground">
          {t("landing.footer.agb")}
        </Link>
        <span>
          © {year} {t("landing.footer.rights")}
        </span>
      </div>
    </footer>
  );
}
