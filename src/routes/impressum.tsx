import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LegalPageShell } from "@/components/legalPageShell";

export const Route = createFileRoute("/impressum")({
  component: ImpressumPage,
});

function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <LegalPageShell title={t("legal.impressum.title")}>
      <p>{t("legal.impressum.placeholder")}</p>
    </LegalPageShell>
  );
}
