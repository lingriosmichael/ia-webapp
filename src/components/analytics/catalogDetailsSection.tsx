import { useTranslation } from "react-i18next";
import { Card } from "@/components/workspaceUI";
import type { EvidenceCatalog } from "@/services/apiClient";
import { formatMetricValue } from "./analyticsFormat";

/** Combines "See full catalog" and "Why was this chosen?" into one
 * disclosure: every entry the assembler produced is listed, marked as
 * featured or not — curation narrows emphasis, it never hides anything.
 * A native <details>/<summary> disclosure keeps this fully keyboard- and
 * screen-reader-accessible without introducing a new dialog primitive. */
export function CatalogDetailsSection({
  catalog,
  featuredEntryIds,
}: {
  catalog: EvidenceCatalog;
  featuredEntryIds: string[];
}) {
  const { t, i18n } = useTranslation();
  const featuredSet = new Set(featuredEntryIds);

  if (catalog.entries.length === 0 && catalog.omittedEntries.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <details>
        <summary className="cursor-pointer text-[13px] font-semibold text-foreground">
          {t("analytics.fullCatalogTitle")}
        </summary>
        <div className="mt-4 space-y-2">
          {catalog.entries.map((entry) => (
            <div
              key={entry.entryId}
              className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-[13px] last:border-b-0"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">
                  {entry.label}
                </div>
                <div className="text-[12px] text-muted-foreground">
                  {featuredSet.has(entry.entryId)
                    ? t("analytics.featured")
                    : t("analytics.notFeatured")}
                </div>
              </div>
              <div className="shrink-0 text-muted-foreground">
                {entry.entryType === "METRIC"
                  ? formatMetricValue(entry, i18n.language)
                  : t("analytics.quoteCount", { count: entry.quoteCount })}
              </div>
            </div>
          ))}

          {catalog.omittedEntries.length > 0 && (
            <div className="pt-3">
              <div className="text-[12px] font-semibold text-muted-foreground">
                {t("analytics.omittedTitle")}
              </div>
              <ul className="mt-1.5 list-inside list-disc space-y-1 text-[12px] text-muted-foreground">
                {catalog.omittedEntries.map((omitted) => (
                  <li key={omitted.knowledgeEntityId}>{omitted.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </Card>
  );
}
