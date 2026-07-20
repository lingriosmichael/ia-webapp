import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LegalPageShell } from "@/components/legalPageShell";

export const Route = createFileRoute("/agb")({
  component: AgbPage,
});

function AgbPage() {
  const { t } = useTranslation();

  return (
    <LegalPageShell title={t("legal.agb.title")}>
      <p>{t("legal.agb.placeholder")}</p>
    </LegalPageShell>
  );
}
