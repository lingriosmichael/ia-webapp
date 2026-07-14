import type { EvidenceCatalogMetricEntry } from "@/services/apiClient";

/** Locale-aware formatting for a metric entry's value — kept in one place
 * so a number never renders differently depending on which component
 * happens to show it. Mirrors exactly what the Grounding Validator checks
 * a curator's narrative text against (see ia_python_service's
 * app/analytics/grounding.py), so a card and a narrative sentence about
 * the same entry always agree. */
export function formatMetricValue(
  entry: Pick<EvidenceCatalogMetricEntry, "value" | "unit">,
  locale: string,
): string {
  if (entry.unit === "ratio") {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(entry.value);
  }

  if (entry.unit === "mean") {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
      entry.value,
    );
  }

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    entry.value,
  );
}
