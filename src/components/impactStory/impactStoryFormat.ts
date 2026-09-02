import type { ImpactIndicatorTileFormat } from "@/services/apiClient";

export function coerceImpactStoryText(
  value: string | null | undefined,
  fallback = "",
): string {
  return typeof value === "string" ? value : fallback;
}

// Recharts sizes an axis tick's hit area to the *untruncated* string, so a
// long category/activity label either wraps (colliding with the next tick's
// row) or overflows past its allotted width — text must never overlap, so
// axis labels are truncated at the data layer before Recharts ever sees
// them. The full label always survives separately (as `fullLabel` in the
// chart components) for the tooltip and legend.
export function truncateChartLabel(
  label: string | null | undefined,
  maxLength: number,
): string {
  const safeLabel = coerceImpactStoryText(label).replace(/\s+/g, " ").trim();
  if (safeLabel.length <= maxLength) {
    return safeLabel;
  }

  const hardCut = safeLabel.slice(0, maxLength - 1).trimEnd();
  const lastSpace = hardCut.lastIndexOf(" ");
  const softCut =
    lastSpace >= Math.floor((maxLength - 1) * 0.55)
      ? hardCut.slice(0, lastSpace).trimEnd()
      : hardCut;

  return `${softCut || hardCut}…`;
}

export function wrapChartLabel(
  label: string | null | undefined,
  maxLineLength: number,
  maxLines = 2,
): string[] {
  const safeLabel = coerceImpactStoryText(label).replace(/\s+/g, " ").trim();
  if (!safeLabel) {
    return [""];
  }

  const words = safeLabel.split(" ");
  const lines: string[] = [];

  while (words.length > 0 && lines.length < maxLines) {
    if (lines.length === maxLines - 1) {
      lines.push(truncateChartLabel(words.join(" "), maxLineLength));
      break;
    }

    let line = words.shift() ?? "";
    while (words.length > 0) {
      const nextLine = `${line} ${words[0]}`;
      if (nextLine.length > maxLineLength) {
        break;
      }
      line = nextLine;
      words.shift();
    }

    lines.push(
      line.length > maxLineLength
        ? truncateChartLabel(line, maxLineLength)
        : line,
    );
  }

  return lines;
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

// Strips a recognized before/after suffix or prefix off a chart datum's
// label (e.g. "Ich fühle mich sicher — Vorher" -> "Ich fühle mich sicher"),
// so a before bar and its after counterpart can be matched back to one
// shared category. Shared between the comparison card view and the
// comparison dialog's expanded content — both need to collapse the same
// flattened before/after datum pairs back into one row per pair.
export function trimComparisonAffix(
  label: string,
  beforeLabel: string,
  afterLabel: string,
): string {
  const suffixes = [
    ` - ${beforeLabel}`,
    ` - ${afterLabel}`,
    ` — ${beforeLabel}`,
    ` — ${afterLabel}`,
  ];
  for (const suffix of suffixes) {
    if (label.endsWith(suffix)) {
      return label.slice(0, -suffix.length).trim();
    }
  }

  const prefixes = [`${beforeLabel}: `, `${afterLabel}: `];
  for (const prefix of prefixes) {
    if (label.startsWith(prefix)) {
      return label.slice(prefix.length).trim();
    }
  }

  return label;
}

// A chart datum's explicit `group` field is authoritative when present
// (every backend-built before/after pair sets it); the label-suffix
// inference below is a fallback only for older/unlabeled data that
// predates the `group` field.
export function inferComparisonGroup(
  label: string,
  group: "before" | "after" | undefined,
  index: number,
  beforeLabel: string,
  afterLabel: string,
): "before" | "after" {
  if (group) {
    return group;
  }

  if (
    label === beforeLabel ||
    label.endsWith(` - ${beforeLabel}`) ||
    label.endsWith(` — ${beforeLabel}`) ||
    label.startsWith(`${beforeLabel}: `)
  ) {
    return "before";
  }

  if (
    label === afterLabel ||
    label.endsWith(` - ${afterLabel}`) ||
    label.endsWith(` — ${afterLabel}`) ||
    label.startsWith(`${afterLabel}: `)
  ) {
    return "after";
  }

  return index % 2 === 0 ? "before" : "after";
}

// Caps a dialog chart's rendered height so it always fits inside
// ImpactStoryBoardCard's expanded dialog (max-h-[88vh] on DialogContent,
// with p-6/sm:p-7 padding around a title + optional subtitle/badge +
// mt-5 gap + optional footer note) without ever needing to scroll,
// regardless of how many rows the chart has. 220px approximates that
// surrounding chrome — generous enough to cover a chart that also has a
// footer note — so whatever's left is what the chart itself gets; the
// 240px floor keeps a very short viewport from clamping the chart to
// nothing. Paired with `maxBarSize` (not `barSize`) on every dialog
// chart's <Bar>, so Recharts shrinks bar thickness to fit this cap
// instead of the chart overflowing past it.
export const DIALOG_CHART_MAX_HEIGHT_CLASS =
  "max-h-[max(240px,calc(88vh-220px))]";

export function formatSignedImpactStoryValue(
  value: number,
  formatAs: ImpactIndicatorTileFormat,
  language: string,
): string {
  const formattedMagnitude = formatImpactStoryValue(
    Math.abs(value),
    formatAs,
    language,
  );

  if (value > 0) {
    return `+${formattedMagnitude}`;
  }
  if (value < 0) {
    return `-${formattedMagnitude}`;
  }
  return formattedMagnitude;
}
