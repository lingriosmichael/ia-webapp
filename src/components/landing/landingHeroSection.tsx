import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { OrganicBlob, SectionFloorFade } from "@/components/landing/landingDecorations";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Three real depth planes (far still, mid ambient loop, near blobs) drifting
// at different rates as the page scrolls — a background/subject/foreground
// separation built from generated assets, not just one flat backdrop.
// Reduced-motion visitors get the static layout with no travel at all.
function useHeroParallax() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = sectionRef.current;
        if (!node) {
          return;
        }
        const rect = node.getBoundingClientRect();
        const travel = Math.min(Math.max(-rect.top, 0), 480);
        setOffset(travel);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return { sectionRef, offset, prefersReducedMotion };
}

export function LandingHeroSection() {
  const { t } = useTranslation();
  const { sectionRef, offset, prefersReducedMotion } = useHeroParallax();

  return (
    <section
      ref={sectionRef}
      className="relative z-0 flex flex-col items-center py-20 text-center lg:py-28"
    >
      {/* Full-bleed background stage: breaks out of the max-w-7xl content
          column so the depth planes run edge to edge instead of leaving
          empty page-background margins on either side. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-30 w-screen -translate-x-1/2 overflow-hidden"
      >
        {/* Far plane: static atmospheric plate, drifts slowest. */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ transform: `translate3d(0, ${offset * 0.04}px, 0)` }}
        >
          <img
            src="/hero-depth-far.jpg"
            alt=""
            className="h-full w-full object-cover object-right-top"
          />
        </div>

        {/* Mid plane: ambient looping drift, or its poster frame when motion
            is reduced. */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ transform: `translate3d(0, ${offset * 0.1}px, 0)` }}
        >
          {!prefersReducedMotion ? (
            <video
              className="h-full w-full object-cover object-[70%_100%]"
              autoPlay
              muted
              loop
              playsInline
              poster="/hero-ambient-poster.jpg"
            >
              <source src="/hero-ambient.mp4" type="video/mp4" media="(min-width: 768px)" />
              <source src="/hero-ambient-m.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/hero-ambient-poster.jpg"
              alt=""
              className="h-full w-full object-cover object-[70%_100%]"
            />
          )}
        </div>

        {/* Fade the section floor (and ceiling): dissolves into the header
            above and the Problem section below instead of a hard seam. */}
        <SectionFloorFade edge="top" />
        <SectionFloorFade edge="bottom" />
      </div>

      {/* Near plane: brand blob shapes, drifts fastest, framing the centered
          copy from the left and right edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ transform: `translate3d(0, ${offset * 0.16}px, 0)` }}
      >
        <OrganicBlob
          tone="skyMist"
          className="absolute -left-8 top-4 h-48 w-48 -rotate-12 sm:-left-16 sm:h-64 sm:w-64 md:h-80 md:w-80"
        />
        <OrganicBlob
          tone="apricot"
          className="absolute -right-8 top-1/3 h-40 w-40 rotate-45 sm:-right-16 md:h-64 md:w-64"
        />
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col items-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/15 bg-card px-3 py-1.5 shadow-[var(--shadow-soft)]">
          <span className="h-1.5 w-1.5 rounded-full bg-apricot" />
          <span className="text-sm text-primary">
            {t("landing.hero.pilotBadge")}
          </span>
          <span className="text-border">·</span>
          <span className="text-sm text-muted-foreground">
            {t("landing.hero.freeBadge")}
          </span>
        </div>

        <h1 className="mt-6 max-w-[16ch] font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-[2.588rem] sm:text-[3.45rem] lg:text-[4.313rem]">
            {t("landing.hero.titleLine1")}
          </span>
          <br />
          {t("landing.hero.titleLine2")}
          <span className="text-signal">
            {t("landing.hero.titleHighlight")}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          {t("landing.hero.description")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <a href="#pilotprogramm">
              {t("landing.hero.ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#termin">{t("landing.hero.ctaSecondary")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
