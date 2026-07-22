import { Link, createFileRoute } from "@tanstack/react-router";
import { UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/ActivityTabs";
import { Card, PageHeader, TopBar } from "@/components/WorkspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useActivityQuery,
  useActivityUploadsQuery,
  useProjectQuery,
} from "@/hooks/useWorkspaceQueries";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/data-review/",
)({
  component: SchemaReview,
});

function SchemaReview() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    uploadsQuery.isLoading
  ) {
    return <CenteredState label={t("schemaReview.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("schemaReview.loadFailed")} />;
  }

  const activity = activityQuery.data;
  const uploads = uploadsQuery.data ?? [];
  const hasDataset = uploads.length > 0;

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          hierarchy.projectCrumb,
          { label: hierarchy.activitiesLabel },
          { label: activity.name },
          { label: t("schemaReview.crumb") },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader
          eyebrow={t("schemaReview.eyebrow")}
          title={t("schemaReview.title")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        {!hasDataset ? (
          <Card className="mt-6 border-primary/15 bg-primary-soft/25 p-8">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {t("schemaReview.empty.title")}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("schemaReview.empty.description")}
              </p>
              <Link
                to="/projects/$projectId/activities"
                params={{ projectId }}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                <UploadCloud className="h-4 w-4" />
                {t("schemaReview.empty.cta")}
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="mt-6 border-primary/15 bg-primary-soft/25 p-8">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {t("schemaReview.notReady.title")}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {t("schemaReview.notReady.description")}
              </p>
              <Link
                to="/projects/$projectId/activities"
                params={{ projectId }}
                className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {t("schemaReview.notReady.cta")}
              </Link>
            </div>
          </Card>
        )}
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
