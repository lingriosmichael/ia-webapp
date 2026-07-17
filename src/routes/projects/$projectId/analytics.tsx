import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useRequireAuth } from "@/hooks/useAuth";
import { useProjectAnalyticsDashboardInteractionTracking } from "@/hooks/useAnalyticsDashboardInteractionTracking";
import {
  useGenerateProjectAnalyticsMutation,
  useProjectAnalyticsQuery,
  useProjectInterpretationsQuery,
  useResetProjectAnalyticsLayoutMutation,
  useUpdateProjectAnalyticsLayoutMutation,
} from "@/hooks/useWorkspaceQueries";
import { AnalyticsStatusBanner } from "@/components/analytics/analyticsStatusBanner";
import { ConfigurableAnalyticsDashboard } from "@/components/analytics/configurableAnalyticsDashboard";
import { apiClient } from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/analytics")({
  component: ProjectAnalyticsPage,
});

export function ProjectAnalyticsPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const analyticsQuery = useProjectAnalyticsQuery(
    projectId,
    Boolean(auth.token),
  );
  const interpretationsQuery = useProjectInterpretationsQuery(
    projectId,
    Boolean(auth.token),
  );
  const generateMutation = useGenerateProjectAnalyticsMutation(projectId);
  const updateLayoutMutation =
    useUpdateProjectAnalyticsLayoutMutation(projectId);
  const resetLayoutMutation = useResetProjectAnalyticsLayoutMutation(projectId);
  useProjectAnalyticsDashboardInteractionTracking(
    projectId,
    Boolean(auth.token),
  );

  if (!auth.token) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  if (analyticsQuery.isLoading || interpretationsQuery.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  if (analyticsQuery.isError || interpretationsQuery.isError) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loadFailed")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  const { execution, result } = analyticsQuery.data ?? {
    execution: null,
    result: null,
  };
  const layoutPreference = analyticsQuery.data?.layoutPreference ?? null;
  const dashboardCompatibilitySource =
    analyticsQuery.data?.dashboardCompatibilitySource ?? null;
  const dashboardUsageSummary =
    analyticsQuery.data?.dashboardUsageSummary ?? null;
  const isExecutionComplete = Boolean(
    execution &&
    ["COMPLETED", "COMPLETED_WITH_WARNINGS"].includes(execution.status),
  );

  return (
    <ProjectWorkspaceShell description={t("projectAnalytics.subtitle")}>
      <div className="space-y-5">
        <AnalyticsStatusBanner
          execution={execution}
          result={result}
          onRegenerate={() => generateMutation.mutate()}
          isRegenerating={generateMutation.isPending}
        />

        {isExecutionComplete && result && result.catalog.entries.length > 0 ? (
          <ConfigurableAnalyticsDashboard
            result={result}
            layoutPreference={layoutPreference}
            dashboardCompatibilitySource={dashboardCompatibilitySource}
            dashboardUsageSummary={dashboardUsageSummary}
            onSaveLayout={(payload) => updateLayoutMutation.mutate(payload)}
            onResetLayout={() => resetLayoutMutation.mutate()}
            onExport={(payload) =>
              apiClient.downloadProjectAnalyticsExport(projectId, payload)
            }
            isSavingLayout={updateLayoutMutation.isPending}
            isResettingLayout={resetLayoutMutation.isPending}
          />
        ) : null}
      </div>
    </ProjectWorkspaceShell>
  );
}
