import { useTranslation } from "react-i18next";
import type { ActivityAiKnowledgeRecord } from "@/services/apiClient";

export function ActivityAiKnowledgeContent({
  knowledge,
}: {
  knowledge: ActivityAiKnowledgeRecord;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        {t("projectWorkspace.interpretation.simplified.knowledgeDialogMeta", {
          count: knowledge.insights.length,
          evidenceCount: knowledge.interpretedEvidenceCount,
        })}
      </div>

      <p className="text-sm leading-8 text-foreground">
        {knowledge.summaryText ||
          t("projectWorkspace.interpretation.simplified.knowledgeDialogEmpty")}
      </p>
    </div>
  );
}
