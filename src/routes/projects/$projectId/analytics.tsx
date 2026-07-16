import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useGenerateProjectAnalyticsMutation,
  useProjectAnalyticsQuery,
  useProjectInterpretationsQuery,
} from "@/hooks/useWorkspaceQueries";
import { deriveAnalyticsReadinessSummary } from "@/lib/interpretationWorkflow";
import { useAnalyticsEmptyStateContent } from "@/hooks/useAnalyticsEmptyStateContent";
import {
  AnalyticsEmptyState,
  analyticsCtaLinkClassName,
} from "@/components/analytics/analyticsEmptyState";
import { AnalyticsStatusBanner } from "@/components/analytics/analyticsStatusBanner";
import { MetricGrid } from "@/components/analytics/metricGrid";
import { ConnectiveNarrativeCallout } from "@/components/analytics/connectiveNarrativeCallout";
import { CatalogDetailsSection } from "@/components/analytics/catalogDetailsSection";

export const Route = createFileRoute("/projects/$projectId/analytics")({
  component: ProjectAnalyticsPage,
});

function ProjectAnalyticsPage() {
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
  const interpretationResults = interpretationsQuery.data?.results ?? [];
  const readiness = deriveAnalyticsReadinessSummary(interpretationResults);
  const {
    title: emptyStateTitle,
    description: emptyStateDescription,
    showCta: showInterpretationCta,
  } = useAnalyticsEmptyStateContent(readiness, "projectAnalytics");

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
          <>
            <MetricGrid
              entries={result.catalog.entries}
              featuredEntryIds={result.curation.featuredEntryIds}
            />
            <ConnectiveNarrativeCallout narrative={result.curation.narrative} />
            <CatalogDetailsSection
              catalog={result.catalog}
              featuredEntryIds={result.curation.featuredEntryIds}
            />
          </>
        )}
      </div>
    </ProjectWorkspaceShell>
  );
}
