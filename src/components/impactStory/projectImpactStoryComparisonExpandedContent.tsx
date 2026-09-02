import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import {
  coerceImpactStoryText,
  DIALOG_CHART_MAX_HEIGHT_CLASS,
  formatImpactStoryValue,
  formatSignedImpactStoryValue,
  inferComparisonGroup,
  trimComparisonAffix,
  wrapChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryVerticalAxisTick } from "./impactStoryAxisTick";
import { IMPACT_STORY_COLORS } from "./projectImpactStoryChartColors";

interface ComparisonRow {
  key: string;
  // The true, never-shortened category text — see
  // ProjectImpactStoryChartDatum.rawLabel's own doc comment. This dialog's
  // detail table has room for the real value, so it (and the chart's own
  // tooltip/axis-hover title) always show this rather than the compact
  // chart's shortened label.
  fullLabel: string;
  // What renders inside the compact chart itself (already shortened by
  // DisplayLabelService when applicable).
  label: string;
  labelLines: string[];
  before: number | null;
  after: number | null;
  delta: number | null;
}

function buildComparisonRows(
  chart: ProjectImpactStoryChartSpec,
  beforeLabel: string,
  afterLabel: string,
): ComparisonRow[] {
  const rowsByKey = new Map<string, ComparisonRow>();

  chart.data.forEach((datum, index) => {
    const fullLabel = coerceImpactStoryText(datum.label);
    const inferredGroup = inferComparisonGroup(
      fullLabel,
      datum.group,
      index,
      beforeLabel,
      afterLabel,
    );
    const baseLabel = trimComparisonAffix(fullLabel, beforeLabel, afterLabel);
    const rowLabel =
      baseLabel === beforeLabel || baseLabel === afterLabel
        ? chart.title
        : baseLabel;
    // Same trim, applied to the true underlying value (falls back to
    // fullLabel itself when this datum was never shortened).
    const trueFullLabel = coerceImpactStoryText(datum.rawLabel ?? datum.label);
    const trueBaseLabel = trimComparisonAffix(
      trueFullLabel,
      beforeLabel,
      afterLabel,
    );
    const trueRowLabel =
      trueBaseLabel === beforeLabel || trueBaseLabel === afterLabel
        ? chart.title
        : trueBaseLabel;
    const key = rowLabel || `${chart.chartId}-${index}`;
    const existingRow =
      rowsByKey.get(key) ??
      ({
        key,
        fullLabel: trueRowLabel || chart.title,
        label: rowLabel || chart.title,
        labelLines: wrapChartLabel(rowLabel || chart.title, 26, 3),
        before: null,
        after: null,
        delta: null,
      } satisfies ComparisonRow);

    if (inferredGroup === "before") {
      existingRow.before = datum.value;
    } else {
      existingRow.after = datum.value;
    }

    rowsByKey.set(key, existingRow);
  });

  const rows = [...rowsByKey.values()].map((row) => ({
    ...row,
    delta:
      row.before !== null && row.after !== null ? row.after - row.before : null,
  }));

  if (rows.length > 4) {
    rows.sort((left, right) => {
      const leftMagnitude = Math.abs(left.delta ?? 0);
      const rightMagnitude = Math.abs(right.delta ?? 0);
      if (rightMagnitude !== leftMagnitude) {
        return rightMagnitude - leftMagnitude;
      }
      return left.fullLabel.localeCompare(right.fullLabel, "de");
    });
  }

  return rows;
}

export function ProjectImpactStoryComparisonExpandedContent({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const beforeLabel = t("impactStory.beforeLabel");
  const afterLabel = t("impactStory.afterLabel");
  const rows = buildComparisonRows(chart, beforeLabel, afterLabel);
  const chartHeight = Math.max(280, rows.length * 56);

  return (
    <div className="space-y-5">
      <div
        className={DIALOG_CHART_MAX_HEIGHT_CLASS}
        style={{ height: chartHeight }}
        role="img"
        aria-label={t("impactStory.barChartAriaLabel", {
          label: chart.title,
          summary: rows
            .map((row) => {
              const before =
                row.before === null
                  ? ""
                  : `${beforeLabel}: ${formatImpactStoryValue(row.before, chart.valueFormat, i18n.language)}`;
              const after =
                row.after === null
                  ? ""
                  : `${afterLabel}: ${formatImpactStoryValue(row.after, chart.valueFormat, i18n.language)}`;
              return [row.fullLabel, before, after].filter(Boolean).join(", ");
            })
            .join("; "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ left: 4, right: 26, top: 10, bottom: 10 }}
            barCategoryGap={rows.length > 6 ? 12 : 18}
          >
            <CartesianGrid
              stroke={IMPACT_STORY_COLORS.lineSoft}
              horizontal={false}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: IMPACT_STORY_COLORS.inkFaint }}
              tickFormatter={(value: number) =>
                formatImpactStoryValue(value, chart.valueFormat, i18n.language)
              }
            />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={250}
              tick={<ImpactStoryVerticalAxisTick data={rows} lineHeight={12} />}
            />
            <Tooltip
              formatter={(value: ValueType | undefined, name) =>
                typeof value === "number"
                  ? [
                      formatImpactStoryValue(
                        value,
                        chart.valueFormat,
                        i18n.language,
                      ),
                      String(name),
                    ]
                  : ""
              }
              labelFormatter={(_, payload) =>
                (payload?.[0]?.payload as ComparisonRow | undefined)
                  ?.fullLabel ?? ""
              }
              cursor={{ fill: IMPACT_STORY_COLORS.lineSoft }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: IMPACT_STORY_COLORS.inkSoft,
              }}
            />
            <Bar
              dataKey="before"
              name={beforeLabel}
              fill={IMPACT_STORY_COLORS.grey}
              radius={[0, 8, 8, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="after"
              name={afterLabel}
              fill={IMPACT_STORY_COLORS.blue}
              radius={[0, 8, 8, 0]}
              maxBarSize={18}
            >
              <LabelList
                dataKey="after"
                position="right"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={12}
                fontWeight={600}
                formatter={(value: unknown) =>
                  typeof value === "number"
                    ? formatImpactStoryValue(
                        value,
                        chart.valueFormat,
                        i18n.language,
                      )
                    : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-border/80 bg-muted/20">
        <div className="grid grid-cols-[minmax(0,1.7fr)_7rem_7rem_7rem] gap-x-3 border-b border-border/70 px-4 py-3 text-[0.72rem] font-semibold tracking-[0.02em] text-muted-foreground uppercase">
          <div>{t("impactStory.comparisonTableLabel")}</div>
          <div className="text-right">{beforeLabel}</div>
          <div className="text-right">{afterLabel}</div>
          <div className="text-right">
            {t("impactStory.comparisonTableChange")}
          </div>
        </div>
        <div className="divide-y divide-border/60">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[minmax(0,1.7fr)_7rem_7rem_7rem] gap-x-3 px-4 py-3 text-sm"
            >
              <div className="min-w-0 leading-5 text-foreground">
                {row.fullLabel}
              </div>
              <div className="text-right text-muted-foreground">
                {row.before === null
                  ? "—"
                  : formatImpactStoryValue(
                      row.before,
                      chart.valueFormat,
                      i18n.language,
                    )}
              </div>
              <div className="text-right text-muted-foreground">
                {row.after === null
                  ? "—"
                  : formatImpactStoryValue(
                      row.after,
                      chart.valueFormat,
                      i18n.language,
                    )}
              </div>
              <div
                className="text-right font-medium"
                style={{
                  color:
                    row.delta === null
                      ? IMPACT_STORY_COLORS.inkSoft
                      : row.delta > 0
                        ? IMPACT_STORY_COLORS.green
                        : row.delta < 0
                          ? IMPACT_STORY_COLORS.coral
                          : IMPACT_STORY_COLORS.inkSoft,
                }}
              >
                {row.delta === null
                  ? "—"
                  : formatSignedImpactStoryValue(
                      row.delta,
                      chart.valueFormat,
                      i18n.language,
                    )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
