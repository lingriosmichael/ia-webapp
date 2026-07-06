import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "@/components/projectCard";
import { useOrganizationWorkspacePage } from "@/contexts/organizationWorkspaceContext";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useWorkspaceShell } from "@/components/workspaceShell";
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
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-8">
        <PageHeader
          eyebrow={locale.organizationProjects.eyebrow}
          title={locale.organizationProjects.title}
          description={locale.organizationProjects.description}
          actions={
            canCreateProject ? (
              <button
                type="button"
                onClick={openProjectDialog}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {locale.organizationProjects.primaryAction}
              </button>
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
                <button
                  type="button"
                  onClick={openProjectDialog}
                  className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  {locale.organizationProjects.primaryAction}
                </button>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workspace.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                activityCount={project.activities.length}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
