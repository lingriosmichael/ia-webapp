import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "@/components/projectCard";
import { Button } from "@/components/ui/button";
import { useOrganizationWorkspacePage } from "@/contexts/organizationWorkspaceContext";
import {
  Card,
  PageContainer,
  PageHeader,
  TopBar,
} from "@/components/workspaceUI";
import {
  useWorkspaceShell,
  WorkspaceMobileNavigationButton,
} from "@/components/workspaceShell";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";

export const Route = createFileRoute("/organizations/$organizationId/projects")(
  {
    component: OrganizationProjectsPage,
  },
);

function OrganizationProjectsPage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const { openProjectDialog } = useWorkspaceShell();
  const locale = useWorkspaceLocale();
  const canCreateProject =
    workspace.organization.permissions?.canCreateProject ?? false;

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: workspace.organization.name,
            to: "/organizations/$organizationId",
            params: { organizationId },
          },
          { label: locale.sidebar.projects },
        ]}
        leading={<WorkspaceMobileNavigationButton />}
      />
      <PageContainer className="py-6 sm:py-7 lg:py-8">
        <PageHeader
          eyebrow={locale.organizationProjects.eyebrow}
          title={locale.organizationProjects.title}
          description={locale.organizationProjects.description}
          actions={
            canCreateProject ? (
              <Button type="button" onClick={openProjectDialog}>
                {locale.organizationProjects.primaryAction}
              </Button>
            ) : undefined
          }
        />

        {workspace.projects.length === 0 ? (
          <Card className="mt-8 p-8 sm:p-10">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {locale.organizationProjects.emptyTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {locale.organizationProjects.emptyDescription}
              </p>
              {canCreateProject ? (
                <Button
                  type="button"
                  onClick={openProjectDialog}
                  className="mt-6"
                >
                  {locale.organizationProjects.primaryAction}
                </Button>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {workspace.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                activityCount={project.activities.length}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
