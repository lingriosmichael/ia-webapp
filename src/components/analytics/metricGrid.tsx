import type { EvidenceCatalogEntry } from "@/services/apiClient";
import { MetricCard } from "./metricCard";
import { ThemeCard } from "./themeCard";

/** Renders only the entries the curator actually featured, in the order
 * it chose — curation narrows what's emphasized here; "See full catalog"
 * (CatalogDetailsSection) is where everything else stays visible. */
export function MetricGrid({
  entries,
  featuredEntryIds,
}: {
  entries: EvidenceCatalogEntry[];
  featuredEntryIds: string[];
}) {
  const entryById = new Map(entries.map((entry) => [entry.entryId, entry]));
  const featuredEntries = featuredEntryIds
    .map((entryId) => entryById.get(entryId))
    .filter((entry): entry is EvidenceCatalogEntry => Boolean(entry));

  if (featuredEntries.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featuredEntries.map((entry) =>
        entry.entryType === "METRIC" ? (
          <MetricCard key={entry.entryId} entry={entry} isFeatured />
        ) : (
          <ThemeCard key={entry.entryId} entry={entry} isFeatured />
        ),
      )}
    </div>
  );
}
