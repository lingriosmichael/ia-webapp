import { useTranslation } from "react-i18next";

// Marks a chart built from confirmed impactCatalog evidence — a
// human-confirmed OutcomeEvidenceLink (see ProjectImpactStoryChartSpec.
// isConfirmedEvidence). Confirmed evidence is now mixed into the same
// unified chartPlan array as grounded-but-unconfirmed charts (2026-08-30
// chart-authoring redesign), so a reader needs a positive visual signal
// for "this one is vetted," not just ImpactStoryExploratoryBadge's
// negative "this one isn't" — the two badges are mutually exclusive in
// practice (see projectImpactStoryChartAuthoringExecution.ts's
// confirmed/unconfirmed mixing rule) but modeled as separate components,
// matching the two independent optional contract fields they render.
export function ImpactStoryConfirmedEvidenceBadge() {
  const { t } = useTranslation();
  return (
    <p className="rounded-2xl bg-primary/10 px-2.5 py-1 text-[0.56rem] font-semibold text-primary">
      {t("impactStory.confirmedEvidenceChartNotice")}
    </p>
  );
}
