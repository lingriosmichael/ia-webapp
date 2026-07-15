import { useTranslation } from "react-i18next";
import type { AnalyticsReadinessSummary } from "@/lib/interpretationWorkflow";

export type AnalyticsEmptyStateNamespace =
  "projectAnalytics" | "activityAnalytics";

export interface AnalyticsEmptyStateContent {
  title: string;
  description: string;
  showCta: boolean;
}

// projectAnalytics and activityAnalytics locale entries mirror the same key
// suffixes (noVerifiedEvidenceTitle, awaitingPreparationTitle, ...) so the
// empty-state copy for a given readiness state can be derived generically
// from just the namespace.
export function useAnalyticsEmptyStateContent(
  readiness: AnalyticsReadinessSummary,
  namespace: AnalyticsEmptyStateNamespace,
): AnalyticsEmptyStateContent {
  const { t } = useTranslation();

  if (readiness.state === "awaiting_preparation") {
    return {
      title: t(`${namespace}.awaitingPreparationTitle`),
      description: t(`${namespace}.awaitingPreparationDescription`, {
        count: readiness.preparationBlockedCount,
      }),
      showCta: true,
    };
  }

  if (readiness.state === "awaiting_analysis") {
    return {
      title: t(`${namespace}.awaitingAnalysisTitle`),
      description: t(`${namespace}.awaitingAnalysisDescription`, {
        count: readiness.awaitingAnalysisCount,
      }),
      showCta: true,
    };
  }

  if (readiness.state === "ready_to_generate") {
    return {
      title: t(`${namespace}.readyToGenerateTitle`),
      description: t(`${namespace}.readyToGenerateDescription`),
      showCta: false,
    };
  }

  return {
    title: t(`${namespace}.noVerifiedEvidenceTitle`),
    description: t(`${namespace}.noVerifiedEvidenceDescription`),
    showCta: true,
  };
}
