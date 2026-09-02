import { useTranslation } from "react-i18next";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { translateGoalAssessmentStatus } from "@/lib/translationUtils";
import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import {
  coerceImpactStoryText,
  formatImpactStoryValue,
} from "./impactStoryFormat";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import { ImpactStoryConfirmedEvidenceBadge } from "./impactStoryConfirmedEvidenceBadge";
import {
  categoricalPieColor,
  statusColor,
} from "./projectImpactStoryChartColors";

// Donut showing share of a whole. Wedges are identified through a legend
// below the chart rather than direct on-wedge labels — recharts' Pie label
// positioning in a compact container reliably clips or omits label text, so
// a legend is both simpler and more robust here. "status" data reuses the
// translated status names; other kinds show their category label as-is
// (already shortened by DisplayLabelService when applicable) — this chart
// never truncates, so there's no hidden text needing a tooltip fallback.
export function ProjectImpactStoryPieChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const isStatus = chart.dataKind === "status";

  const data = chart.data.map((datum) => {
    const rawLabel = coerceImpactStoryText(datum.label);
    return {
      rawLabel,
      label: isStatus ? translateGoalAssessmentStatus(t, rawLabel) : rawLabel,
      value: datum.value,
    };
  });
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  function renderChart(mode: "card" | "dialog") {
    const isDialog = mode === "dialog";

    return (
      <div
        className={
          isDialog
            ? "grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_18rem] lg:items-center"
            : ""
        }
      >
        <div
          className={isDialog ? "h-[360px]" : "h-[220px]"}
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
                innerRadius={isDialog ? "60%" : "56%"}
                outerRadius={isDialog ? "86%" : "78%"}
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
                {isDialog ? (
                  <Label
                    position="center"
                    content={({ viewBox }) => {
                      const centerX =
                        viewBox &&
                        typeof viewBox === "object" &&
                        "cx" in viewBox
                          ? Number(viewBox.cx)
                          : 0;
                      const centerY =
                        viewBox &&
                        typeof viewBox === "object" &&
                        "cy" in viewBox
                          ? Number(viewBox.cy)
                          : 0;
                      return (
                        <text x={centerX} y={centerY} textAnchor="middle">
                          <tspan
                            x={centerX}
                            y={centerY - 4}
                            className="fill-foreground text-[18px] font-semibold"
                          >
                            {formatImpactStoryValue(
                              totalValue,
                              chart.valueFormat,
                              i18n.language,
                            )}
                          </tspan>
                          <tspan
                            x={centerX}
                            y={centerY + 18}
                            className="fill-muted-foreground text-[11px]"
                          >
                            {t("impactStory.pieTotalLabel")}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                ) : null}
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

        {isDialog ? (
          <div className="rounded-[1.35rem] border border-border/80 bg-muted/20 p-4">
            <div className="mb-3 text-[0.72rem] font-semibold tracking-[0.02em] text-muted-foreground uppercase">
              {t("impactStory.pieBreakdownTitle")}
            </div>
            <div className="space-y-3">
              {data.map((entry, index) => {
                const share = totalValue > 0 ? entry.value / totalValue : 0;
                return (
                  <div
                    key={entry.rawLabel}
                    className="rounded-[1rem] border border-border/60 bg-card px-3 py-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            chart.dataKind === "status"
                              ? statusColor(entry.rawLabel)
                              : categoricalPieColor(index),
                        }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-5 font-medium text-foreground">
                          {entry.label}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                          <span>
                            {formatImpactStoryValue(
                              entry.value,
                              chart.valueFormat,
                              i18n.language,
                            )}
                          </span>
                          <span>
                            {formatImpactStoryValue(
                              share,
                              "percentage",
                              i18n.language,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
      badge={
        chart.isConfirmedEvidence ? (
          <ImpactStoryConfirmedEvidenceBadge />
        ) : undefined
      }
      expandedContent={renderChart("dialog")}
    >
      {renderChart("card")}
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
