import { useTranslation } from "react-i18next";

// Marks a chart built from a paired_story_delta catalog entry — a
// before/after pair detected from declared pairing metadata but never
// human-confirmed as outcome evidence (see ProjectImpactStoryChartSpec.
// isExploratory). Must stay visually distinct from a confirmed
// impactCatalog chart, which shares the same before/after shape but a very
// different evidentiary weight. Styling mirrors
// ImpactStoryNarrativeBanner's own "not written by AI" badge.
export function ImpactStoryExploratoryBadge() {
  const { t } = useTranslation();
  return (
    <p className="rounded-2xl bg-secondary px-2.5 py-1 text-[0.56rem] font-semibold text-secondary-foreground">
      {t("impactStory.exploratoryChartNotice")}
    </p>
  );
}
