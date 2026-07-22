import { useTranslation } from "react-i18next";
import { Card } from "@/components/WorkspaceUI";
import type { EvidenceCatalogThemeEntry } from "@/services/apiClient";
import { AiCuratedBadge } from "./aiCuratedBadge";

export function ThemeCard({
  entry,
  isFeatured,
}: {
  entry: EvidenceCatalogThemeEntry;
  isFeatured: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[13px] font-semibold text-foreground">
          {entry.label}
        </div>
        {isFeatured && <AiCuratedBadge />}
      </div>
      <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
        {entry.description}
      </p>
      <div className="mt-3 text-[12px] text-muted-foreground">
        {t("analytics.quoteCount", { count: entry.quoteCount })}
      </div>
    </Card>
  );
}
