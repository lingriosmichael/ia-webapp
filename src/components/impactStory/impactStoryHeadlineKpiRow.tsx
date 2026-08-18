import { Grip } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import type { ProjectImpactStoryHeadlineKpi } from "@/services/apiClient";
import { formatImpactStoryValue } from "./impactStoryFormat";

const detailToneClasses = [
  "text-success",
  "text-success",
  "text-[color:color-mix(in_srgb,var(--signal)_70%,var(--foreground))]",
  "text-[color:color-mix(in_srgb,var(--warning)_85%,var(--foreground))]",
] as const;

export function ImpactStoryHeadlineKpiRow({
  kpis,
}: {
  kpis: ProjectImpactStoryHeadlineKpi[];
}) {
  const { i18n } = useTranslation();
  const visibleKpis = kpis.slice(0, 4);

  if (visibleKpis.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {visibleKpis.map((kpi, index) => (
        <Card
          key={kpi.kpiId}
          className="rounded-[1.75rem] border-border bg-card px-4 py-4 shadow-soft sm:px-[1.125rem] sm:py-[1.125rem]"
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-h-[2.45rem] text-[0.76rem] leading-[1.45] font-semibold text-muted-foreground">
              {kpi.label}
            </div>
            <Grip
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 font-[family-name:var(--font-editorial)] text-[2rem] leading-none tracking-[-0.05em] text-foreground sm:text-[2.25rem]">
            {formatImpactStoryValue(kpi.value, kpi.formatAs, i18n.language)}
          </div>
          {kpi.narrativeReason ? (
            <div
              className={`mt-2 text-[0.72rem] leading-[1.5] font-medium ${detailToneClasses[index] ?? "text-success"}`}
            >
              {kpi.narrativeReason}
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
