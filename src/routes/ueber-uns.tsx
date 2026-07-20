import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LegalPageShell } from "@/components/legalPageShell";

export const Route = createFileRoute("/ueber-uns")({
  component: UeberUnsPage,
});

function UeberUnsPage() {
  const { t } = useTranslation();

  return (
    <LegalPageShell title={t("legal.ueberUns.title")}>
      <p>{t("legal.ueberUns.placeholder")}</p>
    </LegalPageShell>
  );
}
