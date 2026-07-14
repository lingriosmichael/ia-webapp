import { useTranslation } from "react-i18next";
import type { DashboardCurationNarrative } from "@/services/apiClient";
import { AiCuratedBadge } from "./aiCuratedBadge";

/** Rendered as a distinct, labeled callout — never inline with a metric
 * value — so a connective sentence is never mistaken for a deterministic
 * fact. See "Phase 5 — Deterministic Analytics.md", frontend requirements. */
export function ConnectiveNarrativeCallout({
  narrative,
}: {
  narrative: DashboardCurationNarrative[];
}) {
  const { t } = useTranslation();

  if (narrative.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-primary/20 bg-primary-soft/25 p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
          {t("analytics.narrativeTitle")}
        </div>
        <AiCuratedBadge />
      </div>
      <div className="space-y-2">
        {narrative.map((item, index) => (
          <p key={index} className="text-[14px] leading-6 text-foreground">
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}
