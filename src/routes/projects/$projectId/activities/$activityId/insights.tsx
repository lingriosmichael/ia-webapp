import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ActivityAiKnowledgeContent } from "@/components/activityAiKnowledgeContent";
import { ActivityTabs } from "@/components/ActivityTabs";
import { Card, PageHeader, TopBar } from "@/components/WorkspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useAcknowledgeInterpretationReviewMutation,
  useActivityAiKnowledgeQuery,
  useActivityQuery,
} from "@/hooks/useWorkspaceQueries";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/insights",
)({
  component: ActivityInsightsPage,
});

function ActivityInsightsPage() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const knowledgeQuery = useActivityAiKnowledgeQuery(
    activityId,
    Boolean(auth.token),
  );
  const acknowledgeMutation =
    useAcknowledgeInterpretationReviewMutation(activityId);

  useEffect(() => {
    if (
      !activityQuery.data ||
      activityQuery.data.interpretationAcknowledgedAt ||
      !knowledgeQuery.data ||
      acknowledgeMutation.isPending
    ) {
      return;
    }

    acknowledgeMutation.mutate();
  }, [acknowledgeMutation, activityQuery.data, knowledgeQuery.data]);

  if (!auth.token || activityQuery.isLoading) {
    return <CenteredState label={t("activityInsights.loading")} />;
  }

  if (!activityQuery.data) {
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
          { label: activity.name },
          { label: t("activityInsights.crumb") },
        ]}
      />
      <div className="mx-auto w-full max-w-5xl px-8 py-8">
        <PageHeader
          eyebrow={t("activityInsights.eyebrow")}
          title={activity.name}
          description={t("activityInsights.description")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        {knowledgeQuery.isLoading ? (
          <Card className="mt-6 p-6 text-sm text-muted-foreground">
            {t("activityInsights.loading")}
          </Card>
        ) : knowledgeQuery.isError || !knowledgeQuery.data ? (
          <EmptyStateCard
            title={t("activityInsights.notReadyTitle")}
            description={t("activityInsights.notReadyDescription")}
            ctaLabel={t("activityInsights.notReadyCta")}
            projectId={projectId}
          />
        ) : (
          <Card className="mt-6 border-border/70 p-6">
            <ActivityAiKnowledgeContent knowledge={knowledgeQuery.data} />
          </Card>
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
}: {
  title: string;
  description: string;
  ctaLabel: string;
  projectId: string;
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
          to="/projects/$projectId/interpretation"
          params={{ projectId }}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {ctaLabel}
        </Link>
      </div>
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
