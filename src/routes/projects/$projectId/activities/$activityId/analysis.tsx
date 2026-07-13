import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityJobsQuery,
  useActivityQuery,
  useActivityUploadsQuery,
  useProjectQuery,
} from "@/hooks/useGrantready";

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
  const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
  const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    uploadsQuery.isLoading ||
    jobsQuery.isLoading
  ) {
    return <CenteredState label={t("activityAnalytics.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("activityAnalytics.loadFailed")} />;
  }

  const activity = activityQuery.data;
  const uploads = uploadsQuery.data ?? [];
  const jobs = jobsQuery.data ?? [];
  const hasDataset = uploads.length > 0;
  const isProcessing = jobs.some((job) =>
    ["queued", "processing"].includes(job.status),
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
      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader
          eyebrow={t("activityAnalytics.eyebrow")}
          title={t("activityAnalytics.title")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        {!hasDataset ? (
          <WorkflowGate
            title={t("activityAnalytics.gates.noDataset.title")}
            description={t("activityAnalytics.gates.noDataset.description")}
            projectId={projectId}
            cta={t("activityAnalytics.gates.noDataset.cta")}
          />
        ) : isProcessing ? (
          <WorkflowGate
            title={t("activityAnalytics.gates.processing.title")}
            description={t("activityAnalytics.gates.processing.description")}
            projectId={projectId}
            cta={t("activityAnalytics.gates.processing.cta")}
          />
        ) : (
          <WorkflowGate
            title={t("activityAnalytics.gates.notReady.title")}
            description={t("activityAnalytics.gates.notReady.description")}
            projectId={projectId}
            cta={t("activityAnalytics.gates.notReady.cta")}
          />
        )}
      </div>
    </>
  );
}

function WorkflowGate({
  title,
  description,
  projectId,
  cta,
}: {
  title: string;
  description: string;
  projectId: string;
  cta: string;
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
          to="/projects/$projectId/activities"
          params={{ projectId }}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {cta}
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
