import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, FolderKanban, Sparkles, Users2 } from "lucide-react";
import { OrganizationCard } from "@/components/organizationCard";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useOrganizationMembersQuery } from "@/hooks/useGrantready";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useOrganizationWorkspacePage } from "./-organizationWorkspaceContext";

export const Route = createFileRoute("/organizations/$organizationId/")({
  component: OrganizationWorkspacePage,
});

function OrganizationWorkspacePage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const { openProjectDialog } = useWorkspaceShell();
  const locale = useWorkspaceLocale();
  const isOrganizationAdmin =
    workspace.organization.role === "ORGANIZATION_ADMIN";
  const membersQuery = useOrganizationMembersQuery(
    organizationId,
    isOrganizationAdmin,
  );
  const members = membersQuery.data ?? [];
  const recentProjects = [...workspace.projects]
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime(),
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

      <div className="mx-auto w-full max-w-6xl px-8 py-10">
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
          actions={
            workspace.organization.permissions.canCreateProject ? (
              <button
                type="button"
                onClick={openProjectDialog}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {locale.organizationPage.primaryAction}
              </button>
            ) : undefined
          }
        />

        <div className="mt-8 space-y-6">
          <OrganizationCard
            organization={workspace.organization}
            memberCount={
              isOrganizationAdmin ? (membersQuery.data?.length ?? null) : null
            }
            projectCount={workspace.projects.length}
            readOnly={!workspace.organization.permissions.canManageProfile}
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
                {workspace.organization.permissions.canCreateProject ? (
                  <button
                    type="button"
                    onClick={openProjectDialog}
                    className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    {locale.organizationPage.emptyAction}
                  </button>
                ) : null}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                    <FolderKanban className="h-4 w-4 text-primary" />
                    {isOrganizationAdmin
                      ? locale.organizationPage.projectOverview
                      : locale.organizationPage.myProjects}
                  </div>
                  <div className="mt-4 grid gap-3">
                    {recentProjects.map((project) => (
                      <Link
                        key={project.id}
                        to="/projects/$projectId"
                        params={{ projectId: project.id }}
                        className="rounded-2xl border border-border bg-secondary/20 px-4 py-4 transition-colors hover:bg-secondary/40"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          {project.name}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {project.description ||
                            locale.organizationPage.noProjectDescription}
                        </p>
                      </Link>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {locale.organizationPage.recentActivity}
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                    {recentProjects.map((project) => (
                      <li key={project.id}>
                        {project.name}: {project.activities.length}{" "}
                        {locale.organizationPage.activitiesLabel}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="space-y-6">
                {isOrganizationAdmin ? (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                      <Users2 className="h-4 w-4 text-primary" />
                      {locale.organizationPage.membersSummary}
                    </div>
                    <div className="mt-4 space-y-3">
                      {members.slice(0, 5).map((member) => (
                        <div
                          key={member.id}
                          className="rounded-2xl border border-border bg-secondary/20 px-4 py-3"
                        >
                          <div className="text-sm font-medium text-foreground">
                            {member.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/organizations/$organizationId/members"
                      params={{ organizationId }}
                      className="mt-4 inline-flex text-sm font-medium text-primary"
                    >
                      {locale.organizationPage.manageMembers}
                    </Link>
                  </Card>
                ) : null}

                <Card className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    {locale.organizationPage.analyticsPlaceholder}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {isOrganizationAdmin
                      ? locale.organizationPage.analyticsAdminDescription
                      : locale.organizationPage.analyticsManagerDescription}
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
