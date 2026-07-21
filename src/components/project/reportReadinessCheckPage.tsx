import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { ReportReadinessCheckContent } from "@/components/reportReadinessCheckContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/workspaceUI";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useGenerateReportReadinessCheckMutation,
  useReportReadinessCheckQuery,
} from "@/hooks/useWorkspaceQueries";
import { ApiError } from "@/services/apiClient";

// The backend throws a 409 with this code for the ordinary "no check has
// been generated for this project yet" case — that is not a load failure,
// it's the ordinary empty state, so it must not render the same as a real
// error (a network failure, an expired session, a 500).
const NOT_READY_ERROR_CODE = "report_readiness_check_not_ready";

export function ReportReadinessCheckPage() {
  const { projectId } = useParams({ from: "/projects/$projectId/insights" });
  const auth = useRequireAuth();
  const { t, i18n } = useTranslation();
  const query = useReportReadinessCheckQuery(projectId, Boolean(auth.token));
  const generateMutation = useGenerateReportReadinessCheckMutation(projectId);

  async function handleGenerate() {
    try {
      await generateMutation.mutateAsync();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("reportReadinessCheck.generateFailedToast"),
      );
    }
  }

  if (!auth.token || query.isLoading) {
    return (
      <ProjectWorkspaceShell description={t("reportReadinessCheck.subtitle")}>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("reportReadinessCheck.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  const isGenuineLoadError =
    query.isError && query.error.code !== NOT_READY_ERROR_CODE;

  if (isGenuineLoadError) {
    return (
      <ProjectWorkspaceShell description={t("reportReadinessCheck.subtitle")}>
        <Card className="flex flex-col items-center gap-3 p-6 text-center text-sm text-muted-foreground">
          <p>{t("reportReadinessCheck.loadFailed")}</p>
          <Button variant="outline" onClick={() => query.refetch()}>
            {t("reportReadinessCheck.retry")}
          </Button>
        </Card>
      </ProjectWorkspaceShell>
    );
  }

  const result = query.data ?? null;
  const isBusy = generateMutation.isPending;

  return (
    <ProjectWorkspaceShell description={t("reportReadinessCheck.subtitle")}>
      <div className="space-y-5">
        <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="text-sm text-muted-foreground">
            {result
              ? t("reportReadinessCheck.lastGenerated", {
                  date: new Date(result.generatedAt).toLocaleString(
                    i18n.language,
                  ),
                })
              : t("reportReadinessCheck.neverRun")}
          </div>
          <Button onClick={handleGenerate} disabled={isBusy}>
            {isBusy
              ? t("reportReadinessCheck.running")
              : result
                ? t("reportReadinessCheck.rerun")
                : t("reportReadinessCheck.run")}
          </Button>
        </Card>

        {result ? (
          <Card className="border-border/70 p-6">
            <ReportReadinessCheckContent result={result} />
          </Card>
        ) : (
          <Card className="p-6 text-sm text-muted-foreground">
            {t("reportReadinessCheck.neverRunDescription")}
          </Card>
        )}
      </div>
    </ProjectWorkspaceShell>
  );
}
