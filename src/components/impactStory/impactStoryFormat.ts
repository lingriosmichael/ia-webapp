import type { ImpactIndicatorTileFormat } from "@/services/apiClient";

// Recharts sizes an axis tick's hit area to the *untruncated* string, so a
// long category/activity label either wraps (colliding with the next tick's
// row) or overflows past its allotted width — text must never overlap, so
// axis labels are truncated at the data layer before Recharts ever sees
// them. The full label always survives separately (as `fullLabel` in the
// chart components) for the tooltip and legend.
export function truncateChartLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, maxLength - 1).trimEnd()}…`;
}

export function formatImpactStoryValue(
  value: number,
  formatAs: ImpactIndicatorTileFormat,
  language: string,
): string {
  const locale = language === "de" ? "de-DE" : "en-US";

  if (formatAs === "percentage") {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value);
}
