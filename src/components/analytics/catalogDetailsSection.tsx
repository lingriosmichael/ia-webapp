import { useTranslation } from "react-i18next";
import { Card } from "@/components/workspaceUI";
import type {
  EvidenceCatalog,
  EvidenceCatalogMetricEntry,
} from "@/services/apiClient";
import { formatMetricValue } from "./analyticsFormat";

/** Secondary disclosure for analytics entries that were not promoted into
 * the dashboard cards. This avoids duplicating featured KPIs while keeping
 * additional calculable metrics and omitted items available. */
export function CatalogDetailsSection({
  catalog,
  featuredEntryIds,
}: {
  catalog: EvidenceCatalog;
  featuredEntryIds: string[];
}) {
  const { t, i18n } = useTranslation();
  const featuredSet = new Set(featuredEntryIds);
  const secondaryEntries = catalog.entries.filter(
    (entry) => !featuredSet.has(entry.entryId),
  );
  const secondaryMetrics = secondaryEntries.filter(
    (entry): entry is EvidenceCatalogMetricEntry => entry.entryType === "METRIC",
  );
  const secondaryThemes = secondaryEntries.filter(
    (entry) => entry.entryType === "QUALITATIVE_THEME",
  );
  const maximumValueByUnit = secondaryMetrics.reduce<Record<string, number>>(
    (accumulator, entry) => {
      const unitKey = entry.unit ?? "count";
      accumulator[unitKey] = Math.max(
        entry.value,
        accumulator[unitKey] ?? 0,
      );
      return accumulator;
    },
    {},
  );

  if (secondaryEntries.length === 0 && catalog.omittedEntries.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <details>
        <summary className="cursor-pointer text-[13px] font-semibold text-foreground">
          {t("analytics.fullCatalogTitle")}
        </summary>
        <div className="mt-4 space-y-5">
          {secondaryMetrics.length > 0 && (
            <div className="space-y-3">
              <div className="text-[12px] font-medium text-muted-foreground">
                {t("analytics.barChartSectionTitle")}
              </div>
              <div className="grid gap-3">
                {secondaryMetrics.map((entry, index) => (
                  <div
                    key={entry.entryId}
                    className="rounded-[12px] border border-border/65 bg-secondary/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">
                          {entry.label}
                        </div>
                        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                          {entry.description}
                        </p>
                      </div>
                      <div className="shrink-0 text-[13px] font-semibold text-foreground">
                        {formatMetricValue(entry, i18n.language)}
                      </div>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-border/70">
                      <div
                        className="h-full rounded-full transition-[width]"
                        style={{
                          width: `${getMetricBarWidth(entry, maximumValueByUnit)}%`,
                          backgroundColor: `var(--color-chart-${(index % 5) + 1})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {secondaryThemes.length > 0 && (
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-muted-foreground">
                {t("analytics.qualitativeSignalsTitle")}
              </div>
              {secondaryThemes.map((entry) => (
                <div
                  key={entry.entryId}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-[13px] last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">
                      {entry.label}
                    </div>
                    {entry.outcomeReferences.length > 0 && (
                      <div className="truncate text-[12px] text-muted-foreground">
                        {entry.outcomeReferences[0]}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-muted-foreground">
                    {t("analytics.quoteCount", { count: entry.quoteCount })}
                  </div>
                </div>
              ))}
            </div>
          )}

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

function getMetricBarWidth(
  entry: EvidenceCatalogMetricEntry,
  maximumValueByUnit: Record<string, number>,
) {
  if (entry.unit === "ratio") {
    return clampPercentage(entry.value * 100);
  }

  const unitKey = entry.unit ?? "count";
  const maximumValue = maximumValueByUnit[unitKey] ?? 0;

  if (maximumValue <= 0) {
    return 0;
  }

  return clampPercentage((entry.value / maximumValue) * 100);
}

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}
