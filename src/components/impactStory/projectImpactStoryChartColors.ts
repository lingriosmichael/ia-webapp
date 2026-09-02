import type {
  ProjectImpactStoryChartDataKind,
  ProjectImpactStoryGoalStatus,
} from "@/services/apiClient";

export const IMPACT_STORY_COLORS = {
  line: "#E6E2D6",
  lineSoft: "#EEEBE0",
  inkSoft: "#5B5F71",
  inkFaint: "#9A9686",
  green: "#4C8F6B",
  amber: "#C6912F",
  coral: "#C2593F",
  blue: "#2F6690",
  blueSoft: "#9FC1D6",
  grey: "#D8D3C4",
  mint: "#8FBEA3",
} as const;

const STATUS_COLOR_BY_LABEL: Record<string, string> = {
  achieved: IMPACT_STORY_COLORS.green,
  not_achieved: IMPACT_STORY_COLORS.coral,
  requires_clarification: IMPACT_STORY_COLORS.amber,
  requires_capability: IMPACT_STORY_COLORS.amber,
  evidence_compiled: IMPACT_STORY_COLORS.blue,
  qualitative_evidence_only: IMPACT_STORY_COLORS.blue,
  mixed_evidence: IMPACT_STORY_COLORS.blue,
};

export function statusColor(label: string | null | undefined): string {
  const safeLabel = typeof label === "string" ? label : "";
  return STATUS_COLOR_BY_LABEL[safeLabel] ?? "var(--color-muted-foreground)";
}

// Goal-progress status is a genuine good/bad signal (% of target reached),
// so per the collision rule ("when a series means good/bad it wears status
// tokens, never categorical") this stays a small fixed scale, not a
// sequential ramp — reusing the same three status hues goal-assessment KPI
// tiles already use elsewhere on this page.
const GOAL_PROGRESS_STATUS_COLOR: Record<ProjectImpactStoryGoalStatus, string> =
  {
    good: IMPACT_STORY_COLORS.green,
    warn: IMPACT_STORY_COLORS.amber,
    risk: IMPACT_STORY_COLORS.coral,
  };

export function goalProgressStatusColor(
  status: ProjectImpactStoryGoalStatus,
): string {
  return GOAL_PROGRESS_STATUS_COLOR[status];
}

const PIE_CATEGORY_PALETTE = [
  IMPACT_STORY_COLORS.blue,
  IMPACT_STORY_COLORS.green,
  IMPACT_STORY_COLORS.amber,
  IMPACT_STORY_COLORS.blueSoft,
  IMPACT_STORY_COLORS.mint,
  IMPACT_STORY_COLORS.coral,
] as const;

export function categoricalPieColor(index: number): string {
  return PIE_CATEGORY_PALETTE[index % PIE_CATEGORY_PALETTE.length];
}

// A single-series ranked/vertical bar chart encodes magnitude (how many
// applications per district, how many per profession) — a *sequential*
// job, not a categorical one: per the dataviz skill, that means one hue,
// light-to-dark by rank, never a rainbow of unrelated hues within one
// chart ("color follows the entity, never its rank"). The variety this
// project's dashboard was missing has to come from a *different* chart
// picking a *different* hue, not from mixing hues inside one chart.
//
// Each ramp is five steps blending its IMPACT_STORY_COLORS base hue
// toward white at 58%/51%/45%/38%/32% — the exact recipe the original,
// hand-authored blue ramp already followed (verified by reproducing it:
// blending #2F6690 toward white at those fractions reproduces
// blueSoft..#6D9BB8 to within a few RGB units), extended here to
// green/amber/coral/mint so a new hue can be added the same computed way
// instead of eyeballed.
const SEQUENTIAL_RAMPS = [
  [IMPACT_STORY_COLORS.blueSoft, "#93B8D0", "#86AEC8", "#7AA5C0", "#6D9BB8"],
  ["#B4D0C1", "#A7C8B6", "#9DC1AE", "#90BAA3", "#85B39A"], // green
  ["#E7D1A8", "#E3C999", "#E0C28D", "#DCBB7E", "#D8B472"], // amber
  ["#E5B9AE", "#E1AEA1", "#DDA495", "#D99888", "#D68E7C"], // coral
  ["#D0E4D8", "#C8DFD2", "#C1DBCC", "#BAD7C6", "#B3D3C0"], // mint
] as const;

// Deterministic (djb2-style) string hash — same chartId always picks the
// same ramp within one render, but different charts spread across the
// available hues instead of all defaulting to the first one.
function hashStringToIndex(
  value: string | null | undefined,
  modulus: number,
): number {
  const safeValue = typeof value === "string" ? value : "";
  let hash = 5381;
  for (let i = 0; i < safeValue.length; i += 1) {
    hash = (hash * 33) ^ safeValue.charCodeAt(i);
  }
  return Math.abs(hash) % modulus;
}

function sequentialRampForChart(
  chartId: string | null | undefined,
): readonly string[] {
  return SEQUENTIAL_RAMPS[hashStringToIndex(chartId, SEQUENTIAL_RAMPS.length)]!;
}

export function rankedBarColor(
  index: number,
  dataKind: ProjectImpactStoryChartDataKind,
  chartId: string,
): string {
  if (dataKind === "status") {
    return IMPACT_STORY_COLORS.blue;
  }
  const ramp = sequentialRampForChart(chartId);
  return ramp[Math.min(index, ramp.length - 1)] ?? ramp[ramp.length - 1]!;
}

export function verticalBarColor({
  index,
  rawLabel,
  dataKind,
  chartType,
  chartId,
  group,
}: {
  index: number;
  rawLabel: string;
  dataKind: ProjectImpactStoryChartDataKind;
  chartType: "bar" | "comparison";
  chartId: string;
  group?: "before" | "after";
}): string {
  if (dataKind === "status") {
    // Color by the bar's actual status label, not by its position — the
    // backend can group goal-assessment statuses (up to 7 possible values)
    // in arbitrary order, so an index-based guess drifts from the legend,
    // which already colors by label via statusColor.
    return statusColor(rawLabel);
  }

  if (chartType === "comparison") {
    // group is set for a flattened multi-category comparison (e.g.
    // paired_categorical_shift, where each wave can contribute more than
    // one bar) — index alone can't tell a second before-wave category
    // apart from an after-wave one. Falls back to the plain two-bar rule
    // (first bar grey, rest blue) when group is absent, which is every
    // other "comparison" spec today (a single before/after pair, or an
    // LLM chart-plan/backlog side-by-side KPI comparison).
    if (group) {
      return group === "before"
        ? IMPACT_STORY_COLORS.grey
        : IMPACT_STORY_COLORS.blue;
    }
    return index === 0 ? IMPACT_STORY_COLORS.grey : IMPACT_STORY_COLORS.blue;
  }

  const ramp = sequentialRampForChart(chartId);
  return ramp[Math.min(index, ramp.length - 1)] ?? ramp[ramp.length - 1]!;
}
