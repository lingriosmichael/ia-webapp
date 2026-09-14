import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DotGridPattern, SectionFloorFade } from "@/components/landing/landingDecorations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CARD_KEYS = [
  "whatYouGet",
  "whatYouBring",
  "goodToKnow",
  "afterPilot",
] as const;

const CARD_ACCENT: Record<(typeof CARD_KEYS)[number], string> = {
  whatYouGet: "bg-signal",
  whatYouBring: "bg-apricot",
  goodToKnow: "bg-sky-mist",
  afterPilot: "bg-ink",
};

export function LandingPilotProgramSection() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="pilotprogramm" className="scroll-mt-24 relative isolate py-16">
      {/* Full-bleed decor stage, same breakout technique as the hero: runs
          edge to edge instead of getting clipped at the max-w-7xl column. */}
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
        <img
          src="/pilot-texture.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
        />
        <DotGridPattern className="absolute -top-2 right-6 h-24 w-24 opacity-70 md:right-14" />
        <SectionFloorFade edge="top" />
        <SectionFloorFade edge="bottom" />
      </div>

      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t("landing.pilotProgram.title")}
      </h2>

      {/* Cards settle into place (scale + opacity) rather than sliding, and
          each accent bar draws in left-to-right — a quieter echo of the
          connector-line device from "So hilft brindl", not the same
          translate-and-fade already used for the Problem timeline. */}
      <div ref={ref} className="relative mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {CARD_KEYS.map((key, index) => {
          const title = t(`landing.pilotProgram.${key}.title`);
          const items = t(`landing.pilotProgram.${key}.items`, {
            returnObjects: true,
          }) as string[];

          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card transition-[opacity,transform] duration-500 ease-out"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "scale(1)" : "scale(0.96)",
                transitionDelay: `${index * 60}ms`,
              }}
            >
              <div
                className={`h-1 origin-left ${CARD_ACCENT[key]} transition-transform duration-500 ease-out`}
                style={{
                  transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: `${index * 60 + 120}ms`,
                }}
              />
              <div className="p-6">
                <div className="text-sm font-semibold text-foreground">
                  {title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                    >
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
