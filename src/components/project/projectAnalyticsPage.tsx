import { Link, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useProjectAnalyticsDashboardInteractionTracking } from "@/hooks/useAnalyticsDashboardInteractionTracking";
import {
  deriveAnalyticsReadinessSummary,
  type AnalyticsReadinessSummary,
} from "@/lib/interpretationWorkflow";
import { useAnalyticsEmptyStateContent } from "@/hooks/useAnalyticsEmptyStateContent";
import {
  AnalyticsEmptyState,
  analyticsCtaLinkClassName,
} from "@/components/analytics/analyticsEmptyState";
import {
  useGenerateProjectAnalyticsMutation,
  useProjectAnalyticsQuery,
  useProjectInterpretationsQuery,
  useResetProjectAnalyticsLayoutMutation,
  useUpdateProjectAnalyticsLayoutMutation,
} from "@/hooks/useWorkspaceQueries";
import { AnalyticsStatusBanner } from "@/components/analytics/analyticsStatusBanner";
import { ConfigurableAnalyticsDashboard } from "@/components/analytics/configurableAnalyticsDashboard";
import { apiClient, ApiError } from "@/services/apiClient";

export function ProjectAnalyticsPage() {
  const { projectId } = useParams({ from: "/projects/$projectId/analytics" });
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const workspaceProject = useCurrentWorkspaceProject();
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
  const interpretationResults = interpretationsQuery.data?.results ?? [];
  const readiness = deriveAnalyticsReadinessSummary(interpretationResults);
  const evidenceActivities = (workspaceProject?.activities ?? []).filter(
    (activity) => activity.uploadMetadataCount > 0,
  );
  const allEvidenceActivitiesReviewed =
    evidenceActivities.length > 0 &&
    evidenceActivities.every((activity) =>
      Boolean(
        activity.interpretationAcknowledgedAt ||
        activity.aiKnowledgeGeneratedAt,
      ),
    );
  const effectiveReadiness: AnalyticsReadinessSummary =
    allEvidenceActivitiesReviewed && readiness.state !== "ready"
      ? {
          ...readiness,
          state: "ready_to_generate",
          preparationBlockedCount: 0,
          awaitingAnalysisCount: 0,
        }
      : readiness;
  const {
    title: emptyStateTitle,
    description: emptyStateDescription,
    showCta: showInterpretationCta,
  } = useAnalyticsEmptyStateContent(effectiveReadiness, "projectAnalytics");

  async function handleRegenerate() {
    try {
      await generateMutation.mutateAsync();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("analytics.status.FAILED"),
      );
    }
  }

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
    <ProjectWorkspaceShell>
      <div className="space-y-5">
        <AnalyticsStatusBanner
          execution={execution}
          result={result}
          onRegenerate={handleRegenerate}
          isRegenerating={generateMutation.isPending}
        />

        {!isExecutionComplete ||
        !result ||
        result.catalog.entries.length === 0 ? (
          <AnalyticsEmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            cta={
              showInterpretationCta ? (
                <Link
                  to="/projects/$projectId/interpretation"
                  params={{ projectId }}
                  className={analyticsCtaLinkClassName}
                >
                  {t("projectAnalytics.noVerifiedEvidenceCta")}
                </Link>
              ) : undefined
            }
          />
        ) : (
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
        )}
      </div>
    </ProjectWorkspaceShell>
  );
}
