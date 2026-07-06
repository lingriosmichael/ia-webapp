import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowUpRight, Clock3, FolderKanban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OrganizationCard } from "@/components/organizationCard";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useOrganizationWorkspacePage } from "@/contexts/organizationWorkspaceContext";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import { formatDateTime, translateStatus } from "@/lib/translationUtils";
import type { WorkspaceActivity, WorkspaceProject } from "@/services/apiClient";

export const Route = createFileRoute("/organizations/$organizationId/")({
  component: OrganizationWorkspacePage,
});

function OrganizationWorkspacePage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const locale = useWorkspaceLocale();
  const { i18n, t } = useTranslation();
  const isOrganizationAdmin =
    workspace.organization.role === "ORGANIZATION_ADMIN";
  const recentProjects = [...workspace.projects]
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime(),
    )
    .slice(0, 3);
  const recentActivities = workspace.projects
    .flatMap((project) =>
      project.activities.map((activity) => ({
        projectId: project.id,
        projectName: project.name,
        activity,
      })),
    )
    .sort(
      (left, right) =>
        new Date(right.activity.updatedAt).getTime() -
        new Date(left.activity.updatedAt).getTime(),
    )
    .slice(0, 5);
  const projectsNeedingAttention = workspace.projects
    .map((project) => {
      if (project.activities.length === 0) {
        return {
          project,
          reason: t("organizationPage.attentionReasons.noActivities"),
        };
      }

      const activitiesWithoutEvidence = project.activities.filter(
        (activity) => activity.uploadMetadataCount === 0,
      ).length;

      if (activitiesWithoutEvidence === project.activities.length) {
        return {
          project,
          reason: t("organizationPage.attentionReasons.noEvidence"),
        };
      }

      if (activitiesWithoutEvidence > 0) {
        return {
          project,
          reason: t("organizationPage.attentionReasons.partialEvidence", {
            missing: activitiesWithoutEvidence,
            total: project.activities.length,
          }),
        };
      }

      return null;
    })
    .filter((item): item is { project: WorkspaceProject; reason: string } =>
      Boolean(item),
    )
    .slice(0, 4);

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.organization.name },
          { label: locale.sidebar.workspace },
        ]}
      />

      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader
          eyebrow={locale.organizationPage.eyebrow}
          title={
            isOrganizationAdmin
              ? locale.organizationPage.adminTitle
              : locale.organizationPage.managerTitle
          }
          description={
            isOrganizationAdmin
              ? locale.organizationPage.adminDescription
              : locale.organizationPage.managerDescription
          }
        />

        <div className="mt-8 space-y-6">
          <OrganizationCard
            organization={workspace.organization}
            memberCount={workspace.organization.memberCount ?? 0}
            projectCount={workspace.projects.length}
          />

          {workspace.projects.length === 0 ? (
            <Card className="p-8 sm:p-10">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {locale.organizationPage.emptyTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {locale.organizationPage.emptyDescription}
                </p>
                <Link
                  to="/organizations/$organizationId/projects"
                  params={{ organizationId }}
                  className="mt-6 inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {locale.organizationPage.openProjectsPage}
                </Link>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                      <FolderKanban className="h-4 w-4 text-primary" />
                      {locale.organizationPage.continueWorking}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {locale.organizationPage.continueWorkingDescription}
                    </p>
                  </div>
                  <Link
                    to="/organizations/$organizationId/projects"
                    params={{ organizationId }}
                    className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {locale.organizationPage.viewAllProjects}
                  </Link>
                </div>

                <div className="mt-5 grid gap-3">
                  {recentProjects.map((project) => (
                    <RecentProjectRow key={project.id} project={project} />
                  ))}
                </div>
              </Card>

              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {locale.organizationPage.recentActivity}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale.organizationPage.recentActivityDescription}
                  </p>

                  {recentActivities.length === 0 ? (
                    <p className="mt-5 text-sm text-muted-foreground">
                      {locale.organizationPage.noRecentActivity}
                    </p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {recentActivities.map(
                        ({ projectId, projectName, activity }) => (
                          <RecentActivityRow
                            key={activity.id}
                            activity={activity}
                            projectId={projectId}
                            projectName={projectName}
                            language={i18n.language}
                          />
                        ),
                      )}
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    {locale.organizationPage.projectsNeedingAttention}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {
                      locale.organizationPage
                        .projectsNeedingAttentionDescription
                    }
                  </p>

                  {projectsNeedingAttention.length === 0 ? (
                    <p className="mt-5 text-sm text-muted-foreground">
                      {locale.organizationPage.allProjectsOnTrack}
                    </p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {projectsNeedingAttention.map(({ project, reason }) => (
                        <AttentionProjectRow
                          key={project.id}
                          project={project}
                          reason={reason}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function RecentProjectRow({ project }: { project: WorkspaceProject }) {
  const { t, i18n } = useTranslation();
  const locale = useWorkspaceLocale();
  const summary =
    resolveProjectSummaryText(project) ??
    locale.organizationPage.noProjectDescription;

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-secondary/20 px-4 py-4 transition-colors hover:border-primary/25 hover:bg-primary-soft/40"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">
          {project.name}
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {summary}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-background px-2.5 py-1">
            {project.activities.length} {locale.sidebar.activities}
          </span>
          <span className="rounded-full border border-border bg-background px-2.5 py-1">
            {translateStatus(t, project.status)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right text-xs text-muted-foreground sm:block">
          <div>{t("projectCard.updated")}</div>
          <div className="mt-1 text-foreground">
            {formatDateTime(project.updatedAt, i18n.language)}
          </div>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors group-hover:border-primary/25 group-hover:text-primary">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

function RecentActivityRow({
  activity,
  projectId,
  projectName,
  language,
}: {
  activity: WorkspaceActivity;
  projectId: string;
  projectName: string;
  language: string;
}) {
  const { t } = useTranslation();

  return (
    <Link
      to="/projects/$projectId/activities/$activityId/overview"
      params={{ projectId, activityId: activity.id }}
      className="block rounded-2xl border border-border bg-secondary/20 px-4 py-4 transition-colors hover:border-primary/25 hover:bg-primary-soft/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">
            {activity.name}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {projectName}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {formatDateTime(activity.updatedAt, language)}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border bg-background px-2.5 py-1">
          {translateStatus(t, activity.status)}
        </span>
        <span className="rounded-full border border-border bg-background px-2.5 py-1">
          {t("organizationPage.recentActivityUploads", {
            count: activity.uploadMetadataCount,
          })}
        </span>
      </div>
    </Link>
  );
}

function AttentionProjectRow({
  project,
  reason,
}: {
  project: WorkspaceProject;
  reason: string;
}) {
  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="block rounded-2xl border border-border bg-secondary/20 px-4 py-4 transition-colors hover:border-primary/25 hover:bg-primary-soft/40"
    >
      <div className="text-sm font-semibold text-foreground">
        {project.name}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{reason}</p>
    </Link>
  );
}
