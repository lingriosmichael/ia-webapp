import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { translateGoalAssessmentStatus } from "@/lib/translationUtils";
import type { ProjectImpactStoryChartSpec } from "@/services/apiClient";
import {
  coerceImpactStoryText,
  formatImpactStoryValue,
  inferComparisonGroup,
  trimComparisonAffix,
  truncateChartLabel,
  wrapChartLabel,
} from "./impactStoryFormat";
import { ImpactStoryHorizontalAxisTick } from "./impactStoryAxisTick";
import { ImpactStoryBoardCard } from "./impactStoryBoardCard";
import { ImpactStoryConfirmedEvidenceBadge } from "./impactStoryConfirmedEvidenceBadge";
import { ImpactStoryExploratoryBadge } from "./impactStoryExploratoryBadge";
import { ProjectImpactStoryComparisonExpandedContent } from "./projectImpactStoryComparisonExpandedContent";
import {
  IMPACT_STORY_COLORS,
  verticalBarColor,
} from "./projectImpactStoryChartColors";
import { ProjectImpactStoryChartLegend } from "./projectImpactStoryChartLegend";

// Shorter than the distribution chart's cap: a vertical column has far less
// horizontal room per label than a horizontal row does, especially once
// several bars share the width — see truncateChartLabel's doc comment.
const CARD_MAX_CATEGORY_LABEL_LENGTH = 18;
const DIALOG_MAX_CATEGORY_LABEL_LENGTH = 32;

interface PairedBarRow {
  key: string;
  // What should actually render on the axis/bar — the category text after
  // stripping the before/after prefix, sourced from `datum.label` (already
  // shortened by DisplayLabelService when applicable).
  displayLabel: string;
  // The true, never-shortened category text — see
  // ProjectImpactStoryChartDatum.rawLabel's own doc comment. Falls back to
  // displayLabel when this row was never shortened.
  tooltipLabel: string;
  before: number;
  after: number;
}

// Collapses a "comparison" chart's flattened before/after data points back
// into one row per pair (see impactStoryFormat.ts's trimComparisonAffix/
// inferComparisonGroup — the same matching logic
// ProjectImpactStoryComparisonExpandedContent's dialog view already uses)
// so the axis shows one category per pair instead of two adjacent,
// near-identical-looking truncated labels (the raw label and its before/
// after suffix collapse to the same text once truncated). Returns null —
// falling back to the existing one-bar-per-datum rendering below — for any
// comparison data this can't cleanly reconstruct into pairs: a datum with
// no group at all (an LLM-authored side-by-side KPI comparison never sets
// one), or more/fewer than exactly one before and one after per row (e.g.
// a paired_categorical_shift wave with more than one category per side).
function buildPairedBarRows(
  data: ProjectImpactStoryChartSpec["data"],
  beforeLabel: string,
  afterLabel: string,
): PairedBarRow[] | null {
  if (data.length === 0 || !data.every((datum) => Boolean(datum.group))) {
    return null;
  }

  const rowsByKey = new Map<
    string,
    {
      displayLabel: string;
      tooltipLabel: string;
      before: number | null;
      after: number | null;
    }
  >();
  for (const [index, datum] of data.entries()) {
    const fullLabel = coerceImpactStoryText(datum.label);
    const group = inferComparisonGroup(
      fullLabel,
      datum.group,
      index,
      beforeLabel,
      afterLabel,
    );
    const rawLabel = trimComparisonAffix(fullLabel, beforeLabel, afterLabel);
    const key = rawLabel || `row-${index}`;
    // The true underlying category text this datum's compound label was
    // built from (see ProjectImpactStoryChartDatum.rawLabel) — trimmed the
    // same way, so it matches displayLabel one-for-one except for the part
    // DisplayLabelService actually shortened.
    const trueFullLabel = coerceImpactStoryText(datum.rawLabel ?? datum.label);
    const trueRawLabel = trimComparisonAffix(
      trueFullLabel,
      beforeLabel,
      afterLabel,
    );
    const row = rowsByKey.get(key) ?? {
      displayLabel: rawLabel || fullLabel,
      tooltipLabel: trueRawLabel || trueFullLabel,
      before: null,
      after: null,
    };
    if (row[group] !== null) {
      return null;
    }
    row[group] = datum.value;
    rowsByKey.set(key, row);
  }

  const rows: PairedBarRow[] = [];
  for (const [key, row] of rowsByKey) {
    if (row.before === null || row.after === null) {
      return null;
    }
    rows.push({
      key,
      displayLabel: row.displayLabel,
      tooltipLabel: row.tooltipLabel,
      before: row.before,
      after: row.after,
    });
  }
  return rows;
}

// Vertical bars — used for "bar" (breakdown of a single measure) and
// "comparison" (the same measure across activities). All bars share one
// hue unless dataKind is "status" (a genuine per-bar identity), per
// "color follows the entity, never its rank."
export function ProjectImpactStoryBarChart({
  chart,
}: {
  chart: ProjectImpactStoryChartSpec;
}) {
  const { t, i18n } = useTranslation();
  const isStatus = chart.dataKind === "status";
  const beforeLabel = t("impactStory.beforeLabel");
  const afterLabel = t("impactStory.afterLabel");
  const pairedRows =
    chart.chartType === "comparison"
      ? buildPairedBarRows(chart.data, beforeLabel, afterLabel)
      : null;

  const baseData = chart.data.map((datum) => {
    const rawLabel = coerceImpactStoryText(datum.label);
    // What should actually render — status text gets translated; every
    // other kind renders `label` as-is (already shortened by
    // DisplayLabelService when applicable).
    const displayLabel = isStatus
      ? translateGoalAssessmentStatus(t, rawLabel)
      : rawLabel;
    // The true, never-shortened value for tooltip/accessibility use — see
    // ProjectImpactStoryChartDatum.rawLabel's own doc comment. Status data
    // never goes through DisplayLabelService, so it's always just the
    // (translated) display text.
    const fullLabel = isStatus
      ? displayLabel
      : coerceImpactStoryText(datum.rawLabel ?? datum.label);
    return {
      rawLabel,
      displayLabel,
      fullLabel,
      value: datum.value,
      group: datum.group,
    };
  });

  function renderPairedChart(mode: "card" | "dialog", rows: PairedBarRow[]) {
    const isDialog = mode === "dialog";
    const data = rows.map((row) => ({
      ...row,
      // Named `fullLabel` to match ImpactStoryHorizontalAxisTick's expected
      // shape — it renders this in the axis label's hover <title>.
      fullLabel: row.tooltipLabel,
      label: truncateChartLabel(
        row.displayLabel,
        isDialog
          ? DIALOG_MAX_CATEGORY_LABEL_LENGTH
          : CARD_MAX_CATEGORY_LABEL_LENGTH,
      ),
      labelLines: isDialog
        ? wrapChartLabel(row.displayLabel, 14, 2)
        : [
            truncateChartLabel(
              row.displayLabel,
              CARD_MAX_CATEGORY_LABEL_LENGTH,
            ),
          ],
    }));

    const rotateLabels = isDialog ? data.length >= 8 : data.length >= 3;
    const labelAngle = rotateLabels ? (isDialog ? -18 : -24) : 0;
    const axisHeight = rotateLabels ? (isDialog ? 72 : 56) : isDialog ? 44 : 24;
    const valueFormatter = (value: number) =>
      formatImpactStoryValue(value, chart.valueFormat, i18n.language);

    return (
      <div
        className={isDialog ? "h-[400px]" : "h-[220px]"}
        role="img"
        aria-label={t("impactStory.barChartAriaLabel", {
          label: chart.title,
          summary: data
            .map(
              (row) =>
                `${row.fullLabel}: ${beforeLabel} ${valueFormatter(row.before)}, ${afterLabel} ${valueFormatter(row.after)}`,
            )
            .join(", "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={2}
            barCategoryGap={isDialog ? "28%" : "22%"}
            margin={{
              left: 4,
              right: isDialog ? 20 : 8,
              top: 20,
              bottom: rotateLabels ? 16 : 4,
            }}
          >
            <CartesianGrid
              stroke={IMPACT_STORY_COLORS.lineSoft}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              height={axisHeight}
              tick={
                <ImpactStoryHorizontalAxisTick
                  data={data}
                  angle={labelAngle}
                  lineHeight={11}
                />
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: IMPACT_STORY_COLORS.inkFaint }}
              tickFormatter={(value: number) => valueFormatter(value)}
            />
            <Tooltip
              labelFormatter={(_, payload) =>
                (payload?.[0]?.payload as { fullLabel?: string } | undefined)
                  ?.fullLabel ?? ""
              }
              formatter={(value: ValueType | undefined, name) =>
                typeof value === "number"
                  ? [valueFormatter(value), String(name)]
                  : ""
              }
              cursor={{ fill: IMPACT_STORY_COLORS.lineSoft }}
            />
            <Bar
              dataKey="before"
              name={beforeLabel}
              fill={IMPACT_STORY_COLORS.grey}
              radius={[8, 8, 0, 0]}
              barSize={isDialog ? 22 : 16}
            >
              <LabelList
                dataKey="before"
                position="top"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={isDialog ? 12 : 10}
                fontWeight={600}
                formatter={(value: unknown) =>
                  typeof value === "number" ? valueFormatter(value) : ""
                }
              />
            </Bar>
            <Bar
              dataKey="after"
              name={afterLabel}
              fill={IMPACT_STORY_COLORS.blue}
              radius={[8, 8, 0, 0]}
              barSize={isDialog ? 22 : 16}
            >
              <LabelList
                dataKey="after"
                position="top"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={isDialog ? 12 : 10}
                fontWeight={600}
                formatter={(value: unknown) =>
                  typeof value === "number" ? valueFormatter(value) : ""
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  function renderChart(mode: "card" | "dialog") {
    if (pairedRows) {
      return renderPairedChart(mode, pairedRows);
    }

    const isDialog = mode === "dialog";
    const data = baseData.map((entry) => ({
      ...entry,
      label: truncateChartLabel(
        entry.displayLabel,
        isDialog
          ? DIALOG_MAX_CATEGORY_LABEL_LENGTH
          : CARD_MAX_CATEGORY_LABEL_LENGTH,
      ),
      labelLines: isDialog
        ? wrapChartLabel(entry.displayLabel, 14, 2)
        : [
            truncateChartLabel(
              entry.displayLabel,
              CARD_MAX_CATEGORY_LABEL_LENGTH,
            ),
          ],
    }));

    // Chart-type selection (bar vs. the horizontal "distribution" chart) is an
    // LLM judgment call and not a hard guarantee, so this rotates defensively
    // — 3 bars is exactly the count where the model is instructed to prefer
    // "distribution" instead, but a vertical bar chart with 3 categories can
    // still be selected, and text must never overlap regardless.
    const rotateLabels = isDialog ? data.length >= 8 : data.length >= 3;
    const labelAngle = rotateLabels ? (isDialog ? -18 : -24) : 0;
    const axisHeight = rotateLabels ? (isDialog ? 72 : 56) : isDialog ? 44 : 24;

    return (
      <div
        className={isDialog ? "h-[400px]" : "h-[220px]"}
        role="img"
        aria-label={t("impactStory.barChartAriaLabel", {
          label: chart.title,
          summary: data
            .map(
              (entry) =>
                `${entry.fullLabel}: ${formatImpactStoryValue(entry.value, chart.valueFormat, i18n.language)}`,
            )
            .join(", "),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              left: 4,
              right: isDialog ? 20 : 8,
              top: 20,
              bottom: rotateLabels ? 16 : 4,
            }}
          >
            <CartesianGrid
              stroke={IMPACT_STORY_COLORS.lineSoft}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              height={axisHeight}
              tick={
                <ImpactStoryHorizontalAxisTick
                  data={data}
                  angle={labelAngle}
                  lineHeight={11}
                />
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: IMPACT_STORY_COLORS.inkFaint }}
              tickFormatter={(value: number) =>
                formatImpactStoryValue(value, chart.valueFormat, i18n.language)
              }
            />
            <Tooltip
              labelFormatter={(_, payload) =>
                (payload?.[0]?.payload as { fullLabel?: string } | undefined)
                  ?.fullLabel ?? ""
              }
              formatter={(value: ValueType | undefined) =>
                typeof value === "number"
                  ? [
                      formatImpactStoryValue(
                        value,
                        chart.valueFormat,
                        i18n.language,
                      ),
                      chart.title,
                    ]
                  : ""
              }
              cursor={{ fill: IMPACT_STORY_COLORS.lineSoft }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              barSize={isDialog ? 42 : 34}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.rawLabel}
                  fill={verticalBarColor({
                    index,
                    rawLabel: entry.rawLabel,
                    dataKind: chart.dataKind,
                    chartType:
                      chart.chartType === "comparison" ? "comparison" : "bar",
                    chartId: chart.chartId,
                    group: entry.group,
                  })}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fill={IMPACT_STORY_COLORS.inkSoft}
                fontSize={isDialog ? 12 : 11}
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
    );
  }

  return (
    <ImpactStoryBoardCard
      title={chart.title}
      subtitle={chart.subtitle}
      note={chart.narrativeReason}
      badge={
        chart.isExploratory ? (
          <ImpactStoryExploratoryBadge />
        ) : chart.isConfirmedEvidence ? (
          <ImpactStoryConfirmedEvidenceBadge />
        ) : undefined
      }
      expandedContent={
        chart.chartType === "comparison" ? (
          <ProjectImpactStoryComparisonExpandedContent chart={chart} />
        ) : (
          renderChart("dialog")
        )
      }
    >
      {renderChart("card")}
      {pairedRows ? (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {(
            [
              [beforeLabel, IMPACT_STORY_COLORS.grey],
              [afterLabel, IMPACT_STORY_COLORS.blue],
            ] as const
          ).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-[0.72rem] leading-[1.4] text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <ProjectImpactStoryChartLegend
          labels={baseData.map((entry) => entry.rawLabel)}
          dataKind={chart.dataKind}
        />
      )}
    </ImpactStoryBoardCard>
  );
}
