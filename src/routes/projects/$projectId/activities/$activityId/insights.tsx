import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { Badge } from "@/components/ui/badge";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityQuery,
  useProjectInterpretationsQuery,
  useProjectQuery,
} from "@/hooks/useGrantready";
import type {
  InterpretationGoalCoverage,
  InterpretationIndicator,
} from "@/services/apiClient";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/insights",
)({
  component: ActivityInsightsPage,
});

function ActivityInsightsPage() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const interpretationsQuery = useProjectInterpretationsQuery(
    projectId,
    Boolean(auth.token),
  );
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    interpretationsQuery.isLoading
  ) {
    return <CenteredState label={t("activityInsights.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("activityInsights.loadFailed")} />;
  }

  const activity = activityQuery.data;
  const hasStatedGoals = Boolean(
    activity.objectives?.trim() || activity.successIndicators?.trim(),
  );
  const result = interpretationsQuery.data?.results.find(
    (candidate) => candidate.activityId === activityId,
  );

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          hierarchy.projectCrumb,
          { label: hierarchy.activitiesLabel },
          {
            label: activity.name,
            to: "/projects/$projectId/activities/$activityId/overview",
            params: { projectId, activityId },
          },
          { label: t("activityInsights.crumb") },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader
          eyebrow={t("activityInsights.eyebrow")}
          title={t("activityInsights.title")}
          description={t("activityInsights.description")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        {!hasStatedGoals ? (
          <EmptyStateCard
            title={t("activityInsights.noGoalsTitle")}
            description={t("activityInsights.noGoalsDescription")}
            ctaLabel={t("activityInsights.noGoalsCta")}
            projectId={projectId}
            activityId={activityId}
          />
        ) : !result ? (
          <EmptyStateCard
            title={t("activityInsights.noAnalysisTitle")}
            description={t("activityInsights.noAnalysisDescription")}
            ctaLabel={t("activityInsights.noAnalysisCta")}
            projectId={projectId}
            activityId={activityId}
          />
        ) : (
          <GoalCoverageSections
            coverage={result.goalAlignment}
            indicators={result.indicators}
          />
        )}
      </div>
    </>
  );
}

function EmptyStateCard({
  title,
  description,
  ctaLabel,
  projectId,
  activityId,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  projectId: string;
  activityId: string;
}) {
  return (
    <Card className="mt-6 border-primary/15 bg-primary-soft/25 p-8">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        <Link
          to="/projects/$projectId/activities/$activityId/overview"
          params={{ projectId, activityId }}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {ctaLabel}
        </Link>
      </div>
    </Card>
  );
}

function GoalCoverageSections({
  coverage,
  indicators,
}: {
  coverage: InterpretationGoalCoverage[];
  indicators: InterpretationIndicator[];
}) {
  const { t } = useTranslation();
  const indicatorNameById = new Map(
    indicators.map((indicator) => [indicator.id, indicator.name]),
  );

  const covered = coverage.filter((entry) => entry.isSupportedByData);
  const notCovered = coverage.filter((entry) => !entry.isSupportedByData);

  if (coverage.length === 0) {
    return (
      <Card className="mt-6 p-6 text-sm text-muted-foreground">
        {t("activityInsights.noCoverageDescription")}
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {t("activityInsights.coveredTitle")}
        </div>
        {covered.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground">
            {t("activityInsights.coveredEmpty")}
          </Card>
        ) : (
          covered.map((entry) => (
            <Card key={entry.id} className="p-5">
              <p className="text-sm font-medium text-foreground">
                {entry.goalSummary}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {entry.relatedIndicatorIds.map((indicatorId) => (
                  <Badge key={indicatorId} variant="outline">
                    {indicatorNameById.get(indicatorId) ?? indicatorId}
                  </Badge>
                ))}
              </div>
            </Card>
          ))
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <XCircle className="h-4 w-4 text-destructive" />
          {t("activityInsights.notCoveredTitle")}
        </div>
        {notCovered.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground">
            {t("activityInsights.notCoveredEmpty")}
          </Card>
        ) : (
          notCovered.map((entry) => (
            <Card key={entry.id} className="p-5">
              <p className="text-sm font-medium text-foreground">
                {entry.goalSummary}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {entry.gapExplanation}
              </p>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
