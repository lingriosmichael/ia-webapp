import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LandingFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 flex flex-col gap-4 border-t border-border/70 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">
          {t("common.brand")}
        </span>
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
