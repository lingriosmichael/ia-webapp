import { useTranslation } from "react-i18next";
import { DotGridPattern, OrganicBlob } from "@/components/landing/landingDecorations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function LandingProblemSection() {
  const { t } = useTranslation();
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();
  const items = t("landing.problem.items", {
    returnObjects: true,
  }) as { title: string; description: string }[];

  return (
    <section className="relative isolate pb-16 pt-8 sm:pt-10">
      {/* Full-bleed decor stage, same breakout technique as the hero: runs
          edge to edge instead of getting clipped at the max-w-7xl column. */}
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
        <OrganicBlob
          tone="pistachio"
          className="absolute -left-12 -top-20 h-80 w-80 rotate-12 sm:h-96 sm:w-96"
        />
        <DotGridPattern className="absolute right-6 top-1/4 h-28 w-28 opacity-60" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
        <div className="relative isolate hidden lg:block">
          <OrganicBlob
            tone="apricot"
            className="absolute -bottom-8 -right-10 -z-10 h-36 w-36 rotate-45"
          />
          <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]">
            <img
              src="/problem-desk.jpg"
              alt=""
              className="aspect-[3/4] w-full max-w-sm object-cover"
            />
          </div>
        </div>

        <div>
          <div className="h-1 w-10 rounded-full bg-signal" />
          <h2 className="mt-3 max-w-sm text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("landing.problem.title")}
          </h2>

          <div ref={ref} className="relative mt-8 border-l border-border/70 pl-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative pb-10 last:pb-0 transition-[opacity,transform] duration-500 ease-out"
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? "translateX(0)" : "translateX(-14px)",
                  transitionDelay: `${index * 70}ms`,
                }}
              >
                <span className="absolute -left-[calc(2rem+3.5px)] top-1.5 h-[7px] w-[7px] rounded-full bg-apricot" />
                <div className="text-base font-semibold text-foreground">
                  {item.title}
                </div>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
