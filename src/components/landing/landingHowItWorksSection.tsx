import { BarChart3, FileText, FolderInput } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICONS = [FolderInput, BarChart3, FileText];

export function LandingHowItWorksSection() {
  const { t } = useTranslation();
  const steps = t("landing.howItWorks.steps", {
    returnObjects: true,
  }) as { title: string; description: string }[];

  return (
    <section id="so-funktionierts" className="scroll-mt-24 py-16">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t("landing.howItWorks.title")}
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-2xl border border-border/70 bg-card p-6 text-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
                <Icon className="h-6 w-6 text-primary" />
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <div className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </div>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
