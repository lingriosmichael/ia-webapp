import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Clock3, FolderKanban } from "lucide-react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { OrganizationCard } from "@/components/organizationCard";
import { StatusBadge } from "@/components/statusBadge";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  Card,
  PageHeader,
  TopBar,
} from "@/components/workspaceUI";
import { useOrganizationWorkspacePage } from "@/contexts/organizationWorkspaceContext";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import {
  formatDateTime,
  formatMonthRange,
  translateStatus,
} from "@/lib/translationUtils";
import { WorkspaceMobileNavigationButton } from "@/components/workspaceShell";
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
  const nextAction = getNextWorkspaceAction(t, workspace.projects);

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.organization.name },
          { label: locale.sidebar.workspace },
        ]}
        leading={<WorkspaceMobileNavigationButton />}
      />

      <PageContainer className="py-6 sm:py-7 lg:py-8">
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
                <Button asChild variant="outline" className="mt-6">
                  <Link
                    to="/organizations/$organizationId/projects"
                    params={{ organizationId }}
                  >
                    {locale.organizationPage.openProjectsPage}
                  </Link>
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <Card className="border-primary/12 bg-primary-soft/35 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-[40rem]">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                      <FolderKanban className="h-4 w-4 text-primary" />
                      {t("organizationPage.nextActionTitle")}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {nextAction.message}
                    </p>
                  </div>
                  <Button asChild>
                    <Link to={nextAction.to} params={nextAction.params}>
                      {nextAction.actionLabel}
                    </Link>
                  </Button>
                </div>
              </Card>

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
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to="/organizations/$organizationId/projects"
                      params={{ organizationId }}
                    >
                      {locale.organizationPage.viewAllProjects}
                    </Link>
                  </Button>
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
      </PageContainer>
    </>
  );
}

function RecentProjectRow({ project }: { project: WorkspaceProject }) {
  const { t, i18n } = useTranslation();
  const locale = useWorkspaceLocale();
  const period = formatMonthRange(
    project.startMonth,
    project.endMonth,
    i18n.language,
  );
  const summary =
    resolveProjectSummaryText(project) ??
    locale.organizationPage.noProjectDescription;

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group flex flex-col gap-4 rounded-[14px] border border-border/80 bg-secondary/20 px-4 py-4 transition-colors hover:border-primary/20 hover:bg-primary-soft/35 lg:flex-row lg:items-start lg:justify-between"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-foreground">
            {project.name}
          </div>
          <StatusBadge
            status={project.status}
            label={translateStatus(t, project.status)}
          />
        </div>
        <p className="mt-1 line-clamp-2 max-w-[42rem] text-sm leading-6 text-muted-foreground">
          {summary}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {project.fundingProgram ? (
            <span>{project.fundingProgram}</span>
          ) : null}
          {period ? <span>{period}</span> : null}
          <span>
            {project.activities.length} {locale.sidebar.activities}
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
        <div className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors group-hover:border-primary/20 group-hover:text-primary">
          {t("common.open")}
          <ArrowRight className="h-4 w-4" />
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
      to="/projects/$projectId/activities"
      params={{ projectId }}
      className="block rounded-[14px] border border-border/80 bg-secondary/20 px-4 py-4 transition-colors hover:border-primary/20 hover:bg-primary-soft/35"
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
        <StatusBadge
          status={activity.status}
          label={translateStatus(t, activity.status)}
        />
        <span className="rounded-full border border-border/80 bg-background px-2.5 py-1">
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
      className="block rounded-[14px] border border-border/80 bg-secondary/20 px-4 py-4 transition-colors hover:border-primary/20 hover:bg-primary-soft/35"
    >
      <div className="text-sm font-semibold text-foreground">
        {project.name}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{reason}</p>
    </Link>
  );
}

function getNextWorkspaceAction(t: TFunction, projects: WorkspaceProject[]) {
  const projectWithoutActivities = projects.find(
    (project) => project.activities.length === 0,
  );

  if (projectWithoutActivities) {
    return {
      message: t("organizationPage.nextActionStates.createActivity"),
      actionLabel: t("organizationPage.nextActionLabels.openProject"),
      to: "/projects/$projectId" as const,
      params: { projectId: projectWithoutActivities.id },
    };
  }

  const projectWithMissingEvidence = projects.find((project) =>
    project.activities.some((activity) => activity.uploadMetadataCount === 0),
  );

  if (projectWithMissingEvidence) {
    const missingCount = projectWithMissingEvidence.activities.filter(
      (activity) => activity.uploadMetadataCount === 0,
    ).length;

    return {
      message: t("organizationPage.nextActionStates.uploadEvidence", {
        count: missingCount,
      }),
      actionLabel: t("organizationPage.nextActionLabels.uploadEvidence"),
      to: "/projects/$projectId/evidence" as const,
      params: { projectId: projectWithMissingEvidence.id },
    };
  }

  const mostRecentProject = [...projects].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )[0];

  return {
    message: t("organizationPage.nextActionStates.continueProject"),
    actionLabel: t("organizationPage.nextActionLabels.openProject"),
    to: "/projects/$projectId" as const,
    params: { projectId: mostRecentProject?.id ?? "" },
  };
}
