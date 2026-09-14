import { useTranslation } from "react-i18next";
import {
  ConnectorLine,
  DotGridPattern,
  OrganicBlob,
} from "@/components/landing/landingDecorations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEP_PHOTOS = ["/step-collect.jpg", "/step-understand.jpg", "/step-report.jpg"];

export function LandingHowItWorksSection() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();
  const steps = t("landing.howItWorks.steps", {
    returnObjects: true,
  }) as { title: string; description: string }[];

  return (
    <section
      id="so-funktionierts"
      className="scroll-mt-24 relative isolate py-16"
    >
      {/* Full-bleed decor stage, same breakout technique as the hero: runs
          edge to edge instead of getting clipped at the max-w-7xl column. */}
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
        <OrganicBlob
          tone="signal"
          className="absolute -right-10 -top-10 h-64 w-64 rotate-45"
        />
        <OrganicBlob
          tone="apricot"
          className="absolute -left-10 top-1/2 h-40 w-40 -rotate-12"
        />
        <DotGridPattern className="absolute left-6 top-0 h-24 w-24 opacity-50" />
      </div>

      {/* A shape sits directly behind the heading, same as the hero: the
          dark text reads against soft color instead of flat page ground. */}
      <div className="relative isolate">
        <OrganicBlob
          tone="skyMist"
          className="absolute left-1/2 top-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-[58%] rotate-6 blur-2xl"
        />
        <div className="mx-auto h-1 w-10 rounded-full bg-signal" />
        <h2 className="mt-4 text-center text-[2.156rem] font-semibold tracking-tight text-foreground sm:text-[2.588rem]">
          {t("landing.howItWorks.title")}
        </h2>
      </div>

      <div ref={ref} className="relative mt-14">
        <div className="absolute left-[16.5%] right-[16.5%] top-12 hidden h-1 md:top-16 md:block">
          <ConnectorLine drawn={isRevealed} className="h-full w-full" />
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center transition-[opacity,transform] duration-500 ease-out"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${index * 70}ms`,
              }}
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border/70 shadow-[var(--shadow-soft)] md:h-32 md:w-32">
                <img
                  src={STEP_PHOTOS[index]}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute -top-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-apricot text-sm font-semibold text-ink ring-2 ring-background">
                  {index + 1}
                </span>
              </div>
              <div className="mt-5 text-[1.15rem] font-semibold text-foreground">
                {step.title}
              </div>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
