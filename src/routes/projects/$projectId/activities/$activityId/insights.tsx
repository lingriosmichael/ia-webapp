import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityResultsQuery,
  useActivityQuery,
  useProjectQuery,
} from "@/hooks/useGrantready";
import { getProjectInsights } from "@/lib/mockData";

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
  const resultsQuery = useActivityResultsQuery(activityId, Boolean(auth.token));
  const { t } = useTranslation();

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    resultsQuery.isLoading
  ) {
    return <CenteredState label={t("activityInsights.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("activityInsights.loadFailed")} />;
  }

  const project = projectQuery.data;
  const activity = activityQuery.data;
  const results = resultsQuery.data ?? [];
  const availableInsights = results.filter(
    (result) => result.status === "available",
  ).length;
  const insights = getProjectInsights(t);
  const privacyItems = Array.isArray(insights.privacy) ? insights.privacy : [];
  const keyFindings = Array.isArray(insights.keyFindings)
    ? insights.keyFindings
    : [];
  const recommendations = Array.isArray(insights.recommendations)
    ? insights.recommendations
    : [];

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: project.name,
            to: "/projects/$projectId",
            params: { projectId },
          },
          { label: activity.name },
          { label: t("activityInsights.crumb") },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
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

        {availableInsights === 0 ? (
          <Card className="mt-6 border-primary/15 bg-primary-soft/25 p-8">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {t("activityInsights.emptyTitle")}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("activityInsights.emptyDescription")}
              </p>
              <Link
                to="/projects/$projectId/activities/$activityId/overview"
                params={{ projectId, activityId }}
                className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {t("activityInsights.emptyCta")}
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <SummaryCard
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                label={t("activityInsights.summary.generated")}
                value={String(availableInsights)}
              />
              <SummaryCard
                icon={<Lightbulb className="h-4 w-4 text-primary" />}
                label={t("activityInsights.summary.keyFindings")}
                value={String(keyFindings.length)}
              />
              <SummaryCard
                icon={<ShieldCheck className="h-4 w-4 text-primary" />}
                label={t("activityInsights.summary.privacyChecks")}
                value={String(privacyItems.length)}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-6">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t("activityInsights.executiveSummaryTitle")}
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {insights.executiveSummary}
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {t("activityInsights.privacyBoundaryTitle")}
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {privacyItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <InsightList
                title={t("activityInsights.keyFindingsTitle")}
                items={keyFindings}
              />
              <InsightList
                title={t("activityInsights.recommendationsTitle")}
                items={recommendations}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold tracking-tight">{value}</div>
    </Card>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-6">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
