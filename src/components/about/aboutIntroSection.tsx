import { useTranslation } from "react-i18next";
import { OrganicBlob } from "@/components/landing/landingDecorations";

export function AboutIntroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative isolate pb-4 pt-12 text-center md:pt-16">
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
        <OrganicBlob
          tone="skyMist"
          className="absolute -left-16 top-0 h-64 w-64 rotate-12"
        />
        <OrganicBlob
          tone="apricot"
          className="absolute -right-12 top-1/3 h-48 w-48 -rotate-6"
        />
      </div>

      <div className="mx-auto h-1 w-10 rounded-full bg-signal" />
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {t("about.title")}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        {t("about.intro")}
      </p>
    </section>
  );
}
