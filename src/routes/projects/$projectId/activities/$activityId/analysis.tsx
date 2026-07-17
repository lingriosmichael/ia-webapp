import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { PageHeader, PageContainer, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useActivityAnalyticsDashboardInteractionTracking } from "@/hooks/useAnalyticsDashboardInteractionTracking";
import {
  useActivityAnalyticsQuery,
  useActivityQuery,
  useGenerateActivityAnalyticsMutation,
  useProjectInterpretationsQuery,
  useProjectQuery,
  useResetActivityAnalyticsLayoutMutation,
  useUpdateActivityAnalyticsLayoutMutation,
} from "@/hooks/useWorkspaceQueries";
import { deriveAnalyticsReadinessSummary } from "@/lib/interpretationWorkflow";
import { useAnalyticsEmptyStateContent } from "@/hooks/useAnalyticsEmptyStateContent";
import {
  AnalyticsEmptyState,
  AnalyticsErrorState,
  analyticsCtaLinkClassName,
} from "@/components/analytics/analyticsEmptyState";
import { AnalyticsStatusBanner } from "@/components/analytics/analyticsStatusBanner";
import { ConfigurableAnalyticsDashboard } from "@/components/analytics/configurableAnalyticsDashboard";
import { apiClient } from "@/services/apiClient";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/analysis",
)({
  component: ActivityAnalyticsPage,
});

export function ActivityAnalyticsPage() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const analyticsQuery = useActivityAnalyticsQuery(
    projectId,
    activityId,
    Boolean(auth.token),
  );
  const interpretationsQuery = useProjectInterpretationsQuery(
    projectId,
    Boolean(auth.token),
  );
  const generateMutation = useGenerateActivityAnalyticsMutation(
    projectId,
    activityId,
  );
  const updateLayoutMutation = useUpdateActivityAnalyticsLayoutMutation(
    projectId,
    activityId,
  );
  const resetLayoutMutation = useResetActivityAnalyticsLayoutMutation(
    projectId,
    activityId,
  );
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();
  const interpretationResults = (
    interpretationsQuery.data?.results ?? []
  ).filter(
    (interpretationResult) => interpretationResult.activityId === activityId,
  );
  const readiness = deriveAnalyticsReadinessSummary(interpretationResults);
  const {
    title: emptyStateTitle,
    description: emptyStateDescription,
    showCta: showOverviewCta,
  } = useAnalyticsEmptyStateContent(readiness, "activityAnalytics");
  useActivityAnalyticsDashboardInteractionTracking(
    projectId,
    activityId,
    Boolean(auth.token),
  );

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    analyticsQuery.isLoading ||
    interpretationsQuery.isLoading
  ) {
    return <AnalyticsErrorState label={t("activityAnalytics.loading")} />;
  }

  if (
    !projectQuery.data ||
    !activityQuery.data ||
    analyticsQuery.isError ||
    interpretationsQuery.isError
  ) {
    return <AnalyticsErrorState label={t("activityAnalytics.loadFailed")} />;
  }

  const activity = activityQuery.data;
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
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          hierarchy.projectCrumb,
          { label: hierarchy.activitiesLabel },
          { label: activity.name },
          { label: t("activityAnalytics.crumb") },
        ]}
      />
      <PageContainer className="py-8">
        <PageHeader
          eyebrow={t("activityAnalytics.eyebrow")}
          title={t("activityAnalytics.title")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        <div className="mt-6 space-y-5">
          <AnalyticsStatusBanner
            execution={execution}
            result={result}
            onRegenerate={() => generateMutation.mutate()}
            isRegenerating={generateMutation.isPending}
          />

          {!isExecutionComplete ||
          !result ||
          result.catalog.entries.length === 0 ? (
            <AnalyticsEmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
              cta={
                showOverviewCta ? (
                  <Link
                    to="/projects/$projectId/activities"
                    params={{ projectId }}
                    className={analyticsCtaLinkClassName}
                  >
                    {t("activityAnalytics.noVerifiedEvidenceCta")}
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
                apiClient.downloadActivityAnalyticsExport(
                  projectId,
                  activityId,
                  payload,
                )
              }
              isSavingLayout={updateLayoutMutation.isPending}
              isResettingLayout={resetLayoutMutation.isPending}
            />
          )}
        </div>
      </PageContainer>
    </>
  );
}
