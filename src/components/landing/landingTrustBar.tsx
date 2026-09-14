import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function LandingTrustBar() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();

  // Deliberately the quietest beat on the page: a plain opacity fade, no
  // travel. This is a legal/trust statement, not an experience moment — it
  // gets a calm breath, not another slide-up.
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border/70 bg-card/60 px-6 py-5 transition-opacity duration-500 ease-out"
      style={{ opacity: isRevealed ? 1 : 0 }}
    >
      <div className="mx-auto flex max-w-4xl items-start gap-3 text-sm leading-7 text-muted-foreground">
        <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
        <p>{t("landing.trustBar.statement")}</p>
      </div>
    </div>
  );
}
