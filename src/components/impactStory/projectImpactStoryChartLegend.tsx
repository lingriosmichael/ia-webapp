import { useTranslation } from "react-i18next";
import { translateGoalAssessmentStatus } from "@/lib/translationUtils";
import type { ProjectImpactStoryChartDataKind } from "@/services/apiClient";
import { statusColor } from "./projectImpactStoryChartColors";

// Status colors always ship with a visible label, never color alone (see
// the dataviz skill's status-color rule) — this is that label, shared by
// every chart type that can render dataKind "status" data (bar, pie,
// distribution).
export function ProjectImpactStoryChartLegend({
  labels,
  dataKind,
}: {
  labels: string[];
  dataKind: ProjectImpactStoryChartDataKind;
}) {
  const { t } = useTranslation();

  if (dataKind !== "status" || labels.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
      {labels.map((label) => (
        <div key={label} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: statusColor(label) }}
            aria-hidden="true"
          />
          <span className="text-[0.72rem] leading-[1.4] text-muted-foreground">
            {translateGoalAssessmentStatus(t, label)}
          </span>
        </div>
      ))}
    </div>
  );
}
