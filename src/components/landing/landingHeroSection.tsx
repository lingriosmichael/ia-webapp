import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import "@/components/landing/landingHeroSection.css";

export function LandingHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="grid gap-12 py-16 lg:grid-cols-[minmax(0,0.84fr)_minmax(36rem,1.16fr)] lg:items-center lg:gap-24 lg:py-24 xl:gap-28">
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border border-primary/20 bg-card px-3 py-1.5 text-sm text-primary shadow-[var(--shadow-soft)]">
            {t("landing.hero.pilotBadge")}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            {t("landing.hero.freeBadge")}
          </Badge>
        </div>

        <h1 className="mt-6 max-w-[14ch] font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:max-w-[10.5ch] xl:max-w-[11.5ch]">
          {t("landing.hero.titleLine1")}
          <br />
          {t("landing.hero.titleLine2")}
          <span className="text-signal">
            {t("landing.hero.titleHighlight")}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          {t("landing.hero.description")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <a href="#pilotprogramm">
              {t("landing.hero.ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#kontakt">{t("landing.hero.ctaSecondary")}</a>
          </Button>
        </div>
      </div>

      <div className="hero-visual lg:justify-self-end lg:py-10 xl:py-14">
        <img
          src="/hero-product-mockup.png"
          alt={t("landing.hero.mockupAlt")}
          width={1448}
          height={1086}
          className="lg:scale-[1.12] lg:-translate-x-[1%] xl:scale-[1.22] xl:-translate-x-[3%]"
        />
      </div>
    </section>
  );
}
