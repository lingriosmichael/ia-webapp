import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { translateGoalAssessmentStatus } from "@/lib/translationUtils";
import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import { formatImpactStoryValue } from "./impactStoryFormat";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import {
  categoricalPieColor,
  statusColor,
} from "./projectImpactStoryChartColors";

// Donut showing share of a whole. Wedges are identified through a legend
// below the chart rather than direct on-wedge labels — recharts' Pie label
// positioning in a compact container reliably clips or omits label text, so
// a legend is both simpler and more robust here. "status" data reuses the
// translated status names; other kinds show their raw category label.
export function ProjectImpactStoryPieChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const isStatus = chart.dataKind === "status";

  const data = chart.data.map((datum) => ({
    rawLabel: datum.label,
    label: isStatus
      ? translateGoalAssessmentStatus(t, datum.label)
      : datum.label,
    value: datum.value,
  }));

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
    >
      <div
        className="h-[220px]"
        role="img"
        aria-label={t("impactStory.pieChartAriaLabel", {
          label: chart.title,
          summary: data
            .map(
              (entry) =>
                `${entry.label}: ${formatImpactStoryValue(entry.value, chart.valueFormat, i18n.language)}`,
            )
            .join(", "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="56%"
              outerRadius="78%"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.rawLabel}
                  fill={
                    chart.dataKind === "status"
                      ? statusColor(entry.rawLabel)
                      : categoricalPieColor(index)
                  }
                  stroke="var(--color-card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: ValueType | undefined, _name, item) =>
                typeof value === "number"
                  ? [
                      formatImpactStoryValue(
                        value,
                        chart.valueFormat,
                        i18n.language,
                      ),
                      item?.payload?.label,
                    ]
                  : ""
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {data.map((entry, index) => (
          <div key={entry.rawLabel} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  chart.dataKind === "status"
                    ? statusColor(entry.rawLabel)
                    : categoricalPieColor(index),
              }}
              aria-hidden="true"
            />
            <span className="text-[0.72rem] leading-[1.4] text-muted-foreground">
              {entry.label}
            </span>
          </div>
        ))}
      </div>
    </ImpactStoryBoardCard>
  );
}
