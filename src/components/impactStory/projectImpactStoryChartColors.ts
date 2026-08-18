import type { ProjectImpactStoryChartDataKind } from "@/services/apiClient";

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

const GOAL_ASSESSMENT_STATUS_ORDER = [
  "achieved",
  "evidence_compiled",
  "mixed_evidence",
  "qualitative_evidence_only",
  "not_achieved",
  "requires_clarification",
  "requires_capability",
] as const;

const STATUS_COLOR_BY_LABEL: Record<string, string> = {
  achieved: IMPACT_STORY_COLORS.green,
  not_achieved: IMPACT_STORY_COLORS.coral,
  requires_clarification: IMPACT_STORY_COLORS.amber,
  requires_capability: IMPACT_STORY_COLORS.amber,
  evidence_compiled: IMPACT_STORY_COLORS.blue,
  qualitative_evidence_only: IMPACT_STORY_COLORS.blue,
  mixed_evidence: IMPACT_STORY_COLORS.blue,
};

export function statusColor(label: string): string {
  return STATUS_COLOR_BY_LABEL[label] ?? "var(--color-muted-foreground)";
}

export function sortByStatusOrder<T extends { label: string }>(
  items: T[],
): T[] {
  const orderIndex = new Map<string, number>(
    GOAL_ASSESSMENT_STATUS_ORDER.map((status, index) => [status, index]),
  );
  return [...items].sort(
    (a, b) =>
      (orderIndex.get(a.label) ?? GOAL_ASSESSMENT_STATUS_ORDER.length) -
      (orderIndex.get(b.label) ?? GOAL_ASSESSMENT_STATUS_ORDER.length),
  );
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

export function rankedBarColor(
  index: number,
  dataKind: ProjectImpactStoryChartDataKind,
): string {
  if (dataKind === "status") {
    return IMPACT_STORY_COLORS.blue;
  }
  const ramp = [
    IMPACT_STORY_COLORS.blueSoft,
    "#93B8D0",
    "#86AEC8",
    "#7AA5C0",
    "#6D9BB8",
  ] as const;
  return ramp[Math.min(index, ramp.length - 1)] ?? ramp[ramp.length - 1];
}

export function verticalBarColor({
  index,
  total,
  dataKind,
  chartType,
}: {
  index: number;
  total: number;
  dataKind: ProjectImpactStoryChartDataKind;
  chartType: "bar" | "comparison";
}): string {
  if (dataKind === "status") {
    return statusColor(["achieved", "not_achieved"][index] ?? "");
  }

  if (chartType === "comparison" && total === 2) {
    return index === 0 ? IMPACT_STORY_COLORS.grey : IMPACT_STORY_COLORS.blue;
  }

  if (chartType === "comparison") {
    return index === 0 ? IMPACT_STORY_COLORS.grey : IMPACT_STORY_COLORS.blue;
  }

  return IMPACT_STORY_COLORS.coral;
}

export function resolveDatumColor(
  label: string,
  index: number,
  total: number,
  dataKind: ProjectImpactStoryChartDataKind,
): string {
  if (dataKind === "status") {
    return statusColor(label);
  }
  return total > 1 ? rankedBarColor(index, dataKind) : IMPACT_STORY_COLORS.blue;
}
