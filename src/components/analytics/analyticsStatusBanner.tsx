import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/workspaceUI";
import type {
  AnalyticsExecutionRecord,
  AnalyticsResultRecord,
} from "@/services/apiClient";

const REGENERATE_ELIGIBLE_STATUSES = new Set([
  "STALE",
  "FAILED",
  "NOT_STARTED",
]);

export function AnalyticsStatusBanner({
  execution,
  result,
  onRegenerate,
  isRegenerating,
}: {
  execution: AnalyticsExecutionRecord | null;
  result: AnalyticsResultRecord | null;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const { t, i18n } = useTranslation();
  const status = execution?.status ?? "NOT_STARTED";
  const canRegenerate =
    !isRegenerating &&
    (REGENERATE_ELIGIBLE_STATUSES.has(status) ||
      status === "COMPLETED" ||
      status === "COMPLETED_WITH_WARNINGS");

  return (
    <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] font-medium text-foreground">
          {t(`analytics.status.${status}`)}
        </p>
        {result && (
          <p className="mt-1 text-[12px] text-muted-foreground">
            {t("analytics.generatedAt", {
              date: new Intl.DateTimeFormat(i18n.language, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(result.generatedAt)),
            })}
          </p>
        )}
      </div>
      <Button
        onClick={onRegenerate}
        disabled={!canRegenerate}
        variant={status === "STALE" ? "default" : "outline"}
        size="sm"
      >
        {isRegenerating
          ? t("analytics.actions.generating")
          : t("analytics.actions.generate")}
      </Button>
    </Card>
  );
}
