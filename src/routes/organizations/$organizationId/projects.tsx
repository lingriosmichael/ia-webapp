import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useOrganizationWorkspacePage } from "./route";

export const Route = createFileRoute("/organizations/$organizationId/projects")({
  component: OrganizationProjectsPage,
});

function OrganizationProjectsPage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const { openProjectDialog } = useWorkspaceShell();
  const locale = useWorkspaceLocale();

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.organization.name, to: "/organizations/$organizationId", params: { organizationId } },
          { label: locale.sidebar.projects },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={locale.organizationProjects.eyebrow}
          title={locale.organizationProjects.title}
          description={locale.organizationProjects.description}
          actions={
            workspace.organization.permissions.canCreateProject ? (
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {workspace.projects.map((project) => (
            <Link
              key={project.id}
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              <div className="text-lg font-semibold tracking-tight text-foreground">{project.name}</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {project.description || locale.organizationProjects.noDescription}
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                {project.activities.length} {locale.organizationProjects.activities}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
