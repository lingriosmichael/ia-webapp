import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { PageHeader, PageContainer, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityAnalyticsQuery,
  useActivityQuery,
  useGenerateActivityAnalyticsMutation,
  useProjectInterpretationsQuery,
  useProjectQuery,
} from "@/hooks/useWorkspaceQueries";
import { deriveAnalyticsReadinessSummary } from "@/lib/interpretationWorkflow";
import {
  AnalyticsEmptyState,
  AnalyticsErrorState,
  analyticsCtaLinkClassName,
} from "@/components/analytics/analyticsEmptyState";
import { AnalyticsStatusBanner } from "@/components/analytics/analyticsStatusBanner";
import { MetricGrid } from "@/components/analytics/metricGrid";
import { ConnectiveNarrativeCallout } from "@/components/analytics/connectiveNarrativeCallout";
import { CatalogDetailsSection } from "@/components/analytics/catalogDetailsSection";
import { DataQualityPanel } from "@/components/analytics/dataQualityPanel";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/analysis",
)({
  component: ActivityAnalyticsPage,
});

function ActivityAnalyticsPage() {
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
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();

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
  const interpretationResults = (interpretationsQuery.data?.results ?? []).filter(
    (interpretationResult) => interpretationResult.activityId === activityId,
  );
  const readiness = deriveAnalyticsReadinessSummary(interpretationResults);

  let emptyStateTitle = t("activityAnalytics.noVerifiedEvidenceTitle");
  let emptyStateDescription = t("activityAnalytics.noVerifiedEvidenceDescription");
  let showOverviewCta = true;

  if (readiness.state === "awaiting_preparation") {
    emptyStateTitle = t("activityAnalytics.awaitingPreparationTitle");
    emptyStateDescription = t(
      "activityAnalytics.awaitingPreparationDescription",
      {
        count: readiness.preparationBlockedCount,
      },
    );
  } else if (readiness.state === "awaiting_analysis") {
    emptyStateTitle = t("activityAnalytics.awaitingAnalysisTitle");
    emptyStateDescription = t("activityAnalytics.awaitingAnalysisDescription", {
      count: readiness.awaitingAnalysisCount,
    });
  } else if (readiness.state === "ready_to_generate") {
    emptyStateTitle = t("activityAnalytics.readyToGenerateTitle");
    emptyStateDescription = t("activityAnalytics.readyToGenerateDescription");
    showOverviewCta = false;
  }

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

          {!result || result.catalog.entries.length === 0 ? (
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
            <>
              <MetricGrid
                entries={result.catalog.entries}
                featuredEntryIds={result.curation.featuredEntryIds}
              />
              <ConnectiveNarrativeCallout
                narrative={result.curation.narrative}
              />
              <CatalogDetailsSection
                catalog={result.catalog}
                featuredEntryIds={result.curation.featuredEntryIds}
              />
              <DataQualityPanel result={result} />
            </>
          )}
        </div>
      </PageContainer>
    </>
  );
}
