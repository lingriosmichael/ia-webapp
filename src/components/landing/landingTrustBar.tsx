import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LandingTrustBar() {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 px-6 py-5">
      <div className="mx-auto flex max-w-4xl items-start gap-3 text-sm leading-7 text-muted-foreground">
        <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
        <p>{t("landing.trustBar.statement")}</p>
      </div>
    </div>
  );
}
