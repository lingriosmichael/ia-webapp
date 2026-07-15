import { useTranslation } from "react-i18next";
import { Card } from "@/components/workspaceUI";
import type { AnalyticsResultRecord } from "@/services/apiClient";

export function DataQualityPanel({
  result,
}: {
  result: AnalyticsResultRecord;
}) {
  const { t } = useTranslation();
  const warnings =
    result.dataQuality.warnings.length > 0
      ? result.dataQuality.warnings
      : result.limitations;
  const hasLimitations = warnings.length > 0;
  const hasFallbackNotice = result.curation.fellBackToSelectionOnly;

  if (!hasLimitations && !hasFallbackNotice) {
    return null;
  }

  return (
    <Card className="p-5">
      <div className="text-[13px] font-semibold text-foreground">
        {t("analytics.dataQualityTitle")}
      </div>
      {hasFallbackNotice && (
        <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
          {t("analytics.groundingFallbackNotice")}
        </p>
      )}
      {hasLimitations && (
        <ul className="mt-2 list-inside list-disc space-y-1 text-[13px] text-muted-foreground">
          {warnings.map((limitation, index) => (
            <li key={index}>{limitation}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
