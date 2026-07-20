import { Clock, Folder, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICONS = [Folder, Clock, HelpCircle];

export function LandingProblemSection() {
  const { t } = useTranslation();
  const items = t("landing.problem.items", {
    returnObjects: true,
  }) as { title: string; description: string }[];

  return (
    <section className="py-16">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t("landing.problem.title")}
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 text-base font-semibold text-foreground">
                {item.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
