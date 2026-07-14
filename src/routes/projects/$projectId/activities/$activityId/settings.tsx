import { createFileRoute } from "@tanstack/react-router";
import { FileText, Settings2, ShieldCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActivityTabs } from "@/components/activityTabs";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useActivityQuery, useProjectQuery } from "@/hooks/useWorkspaceQueries";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import { formatDateTime, translateStatus } from "@/lib/translationUtils";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/settings",
)({
  component: ActivitySettingsPage,
});

function ActivitySettingsPage() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const { t, i18n } = useTranslation();
  const hierarchy = useProjectHierarchy();

  if (!auth.token || projectQuery.isLoading || activityQuery.isLoading) {
    return <CenteredState label={t("activitySettings.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t("activitySettings.loadFailed")} />;
  }

  const project = projectQuery.data;
  const activity = activityQuery.data;
  const workflowGuardrailsValue = t("activitySettings.workflowGuardrails", {
    returnObjects: true,
  });
  const workflowGuardrails = Array.isArray(workflowGuardrailsValue)
    ? workflowGuardrailsValue
    : [];

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          hierarchy.projectCrumb,
          { label: hierarchy.activitiesLabel },
          { label: activity.name },
          { label: t("activitySettings.crumb") },
        ]}
      />
      <div className="mx-auto w-full max-w-5xl px-8 py-8">
        <PageHeader
          eyebrow={t("activitySettings.eyebrow")}
          title={t("activitySettings.title")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Settings2 className="h-4 w-4 text-primary" />
              {t("activitySettings.activityDetailsTitle")}
            </div>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailRow
                label={t("activitySettings.fields.name")}
                value={activity.name}
              />
              <DetailRow
                label={t("activitySettings.fields.status")}
                value={translateStatus(t, activity.status)}
              />
              <DetailRow
                label={t("activitySettings.fields.project")}
                value={project.name}
              />
              <DetailRow
                label={t("activitySettings.fields.owner")}
                value={activity.owner ?? t("activitySettings.noOwner")}
              />
              <DetailRow
                label={t("activitySettings.fields.created")}
                value={formatDateTime(activity.createdAt, i18n.language)}
              />
              <DetailRow
                label={t("activitySettings.fields.updated")}
                value={formatDateTime(activity.updatedAt, i18n.language)}
              />
              <div className="md:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {t("activitySettings.fields.description")}
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {activity.description ?? t("activitySettings.noDescription")}
                </p>
              </div>
            </dl>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {t("activitySettings.workflowGuardrailsTitle")}
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {workflowGuardrails.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <FileText className="h-4 w-4 text-primary" />
                {t("activitySettings.contextTitle")}
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>
                  {resolveProjectSummaryText(project) ??
                    t("activitySettings.noProjectGoal")}
                </li>
                <li>
                  {activity.description ?? t("activitySettings.noDescription")}
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <UserRound className="h-4 w-4 text-primary" />
                {t("activitySettings.supportTitle")}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {t("activitySettings.supportDescription")}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm text-foreground">{value}</div>
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
