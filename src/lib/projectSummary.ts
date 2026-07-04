import type { ProjectImpactModel } from "@/services/apiClient";

export function resolveProjectSummaryText(input: {
  impactModel: ProjectImpactModel;
  successIndicators: string | null;
}) {
  return (
    input.impactModel.impact ??
    input.impactModel.outcomes ??
    input.successIndicators ??
    null
  );
}
