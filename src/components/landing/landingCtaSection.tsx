import { ArrowRight, Rocket, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LandingCtaSection() {
  const { t } = useTranslation();

  return (
    <section
      id="kontakt"
      className="scroll-mt-24 relative overflow-hidden rounded-[28px] border border-border/70 bg-card p-8 sm:p-10"
    >
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-5">
          <div className="relative hidden shrink-0 sm:block">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
              <Rocket className="h-7 w-7 text-primary" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-primary/60" />
          </div>
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {t("landing.cta.titleBefore")}
              <span className="text-primary">
                {t("landing.cta.titleHighlight1")}
              </span>
              {t("landing.cta.titleMiddle")}
              <span className="text-primary">
                {t("landing.cta.titleHighlight2")}
              </span>
              {t("landing.cta.titleAfter")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t("landing.cta.description")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <Button size="lg" asChild>
            <a href="#kontakt">
              {t("landing.cta.primary")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#pilotprogramm">
              {t("landing.cta.secondary")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
