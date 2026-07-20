import { Globe2, Heart, Key, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICONS = [Heart, ShieldCheck, Globe2, Key];

export function LandingTrustBar() {
  const { t } = useTranslation();
  const items = t("landing.trustBar.items", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-border/70 bg-card/60 px-6 py-4">
      {items.map((item, index) => {
        const Icon = ICONS[index % ICONS.length];
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
  );
}
