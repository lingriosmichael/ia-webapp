import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useGenerateProjectAnalyticsMutation,
  useProjectAnalyticsQuery,
} from "@/hooks/useWorkspaceQueries";
import {
  AnalyticsEmptyState,
  analyticsCtaLinkClassName,
} from "@/components/analytics/analyticsEmptyState";
import { AnalyticsStatusBanner } from "@/components/analytics/analyticsStatusBanner";
import { MetricGrid } from "@/components/analytics/metricGrid";
import { ConnectiveNarrativeCallout } from "@/components/analytics/connectiveNarrativeCallout";
import { CatalogDetailsSection } from "@/components/analytics/catalogDetailsSection";
import { DataQualityPanel } from "@/components/analytics/dataQualityPanel";

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
  const generateMutation = useGenerateProjectAnalyticsMutation(projectId);

  if (!auth.token) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  if (analyticsQuery.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  if (analyticsQuery.isError) {
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

  return (
    <ProjectWorkspaceShell description={t("projectAnalytics.subtitle")}>
      <div className="space-y-5">
        <AnalyticsStatusBanner
          execution={execution}
          result={result}
          onRegenerate={() => generateMutation.mutate()}
          isRegenerating={generateMutation.isPending}
        />

        {!result || result.catalog.entries.length === 0 ? (
          <AnalyticsEmptyState
            title={t("projectAnalytics.noVerifiedEvidenceTitle")}
            description={t("projectAnalytics.noVerifiedEvidenceDescription")}
            cta={
              <Link
                to="/projects/$projectId/interpretation"
                params={{ projectId }}
                className={analyticsCtaLinkClassName}
              >
                {t("projectAnalytics.noVerifiedEvidenceCta")}
              </Link>
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
            <DataQualityPanel result={result} />
          </>
        )}
      </div>
    </ProjectWorkspaceShell>
  );
}
