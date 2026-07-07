import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useActivityQuery, useProjectQuery } from "@/hooks/useGrantready";

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
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();

  if (!auth.token || projectQuery.isLoading || activityQuery.isLoading) {
    return <CenteredState label={t("activityInsights.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("activityInsights.loadFailed")} />;
  }

  const activity = activityQuery.data;

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
      </div>
    </>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
