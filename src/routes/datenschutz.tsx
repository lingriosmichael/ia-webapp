import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LegalPageShell } from "@/components/legalPageShell";

export const Route = createFileRoute("/datenschutz")({
  component: DatenschutzPage,
});

function DatenschutzPage() {
  const { t } = useTranslation();

  return (
    <LegalPageShell title={t("legal.datenschutz.title")}>
      <p>{t("legal.datenschutz.placeholder")}</p>
    </LegalPageShell>
  );
}
