import { Check, FlaskConical, Gift, Sparkles, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const CARD_ICONS = [Gift, Users, FlaskConical, Sparkles];
const CARD_KEYS = [
  "whatYouGet",
  "whatYouBring",
  "goodToKnow",
  "afterPilot",
] as const;

export function LandingPilotProgramSection() {
  const { t } = useTranslation();

  return (
    <section id="pilotprogramm" className="scroll-mt-24 py-16">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t("landing.pilotProgram.title")}
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {CARD_KEYS.map((key, index) => {
          const Icon = CARD_ICONS[index];
          const title = t(`landing.pilotProgram.${key}.title`);
          const items = t(`landing.pilotProgram.${key}.items`, {
            returnObjects: true,
          }) as string[];

          return (
            <div
              key={key}
              className="rounded-2xl border border-border/70 bg-card p-6"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <div className="text-sm font-semibold text-foreground">
                  {title}
                </div>
              </div>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                  >
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
