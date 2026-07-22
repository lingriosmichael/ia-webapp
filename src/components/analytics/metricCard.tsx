import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import type { EvidenceCatalogMetricEntry } from "@/services/apiClient";
import { formatMetricValue } from "./analyticsFormat";
import { AiCuratedBadge } from "./aiCuratedBadge";

export function MetricCard({
  entry,
  isFeatured,
}: {
  entry: EvidenceCatalogMetricEntry;
  isFeatured: boolean;
}) {
  const { t, i18n } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12px] font-medium text-muted-foreground">
          {entry.label}
        </div>
        {isFeatured && <AiCuratedBadge />}
      </div>
      <div className="mt-2 text-[28px] font-semibold tracking-tight text-foreground">
        {formatMetricValue(entry, i18n.language)}
      </div>
      {entry.deduplicationConfidence === "not_deduplicated_across_sources" && (
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          {t("analytics.notDeduplicatedNote")}
        </p>
      )}
      <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
        {entry.description}
      </p>
    </Card>
  );
}
