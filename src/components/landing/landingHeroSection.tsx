import { ArrowRight, Database, Handshake, Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import "@/components/landing/landingHeroSection.css";

const TRUST_ICONS = [Database, Handshake, Wand2];

export function LandingHeroSection() {
  const { t } = useTranslation();
  const trustItems = t("landing.hero.trustItems", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border border-primary/20 bg-card px-3 py-1.5 text-sm text-primary shadow-[var(--shadow-soft)]">
            {t("landing.hero.pilotBadge")}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            {t("landing.hero.freeBadge")}
          </Badge>
        </div>

        <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          {t("landing.hero.titleLine1")}
          <br />
          {t("landing.hero.titleLine2")}
          <span className="text-primary">
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

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {trustItems.map((item, index) => {
            const Icon = TRUST_ICONS[index % TRUST_ICONS.length];
            return (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-primary" />
                {item}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hero-visual lg:py-24">
        <img
          src="/hero-product-mockup.png"
          alt={t("landing.hero.mockupAlt")}
          width={1448}
          height={1086}
          className="lg:scale-[1.56]"
        />
      </div>
    </section>
  );
}
