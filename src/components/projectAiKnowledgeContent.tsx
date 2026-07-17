import { useTranslation } from "react-i18next";
import type { ProjectAiKnowledgeRecord } from "@/services/apiClient";

export function ProjectAiKnowledgeContent({
  knowledge,
}: {
  knowledge: ProjectAiKnowledgeRecord;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-xs text-muted-foreground">
        {t("projectInsights.meta", {
          count: knowledge.insights.length,
          activityCount: knowledge.acknowledgedActivityCount,
          evidenceCount: knowledge.interpretedEvidenceCount,
        })}
      </div>

      <p className="text-sm leading-8 text-foreground">
        {knowledge.summaryText || t("projectInsights.empty")}
      </p>

      {knowledge.activities.length > 0 ? (
        <div className="border-t border-border/70 pt-5">
          <div className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {t("projectInsights.activitiesTitle")}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {knowledge.activities.map((activity) => (
              <div
                key={activity.activityId}
                className="rounded-[12px] border border-border/70 bg-secondary/20 p-4"
              >
                <div className="text-sm font-medium text-foreground">
                  {activity.activityName}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {t("projectInsights.activityEvidenceCount", {
                    count: activity.interpretedEvidenceCount,
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
