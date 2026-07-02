import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useOrganizationWorkspacePage } from "./-organizationWorkspaceContext";

export const Route = createFileRoute(
  "/organizations/$organizationId/activities",
)({
  component: OrganizationActivitiesPage,
});

function OrganizationActivitiesPage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const locale = useWorkspaceLocale();
  const activityRows = workspace.projects.flatMap((project) =>
    project.activities.map((activity) => ({
      projectId: project.id,
      projectName: project.name,
      activity,
    })),
  );

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: workspace.organization.name,
            to: "/organizations/$organizationId",
            params: { organizationId },
          },
          { label: locale.sidebar.activities },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={locale.organizationActivities.eyebrow}
          title={locale.organizationActivities.title}
          description={locale.organizationActivities.description}
        />

        <div className="mt-8 grid gap-4">
          {activityRows.map(({ projectId, projectName, activity }) => (
            <Card key={activity.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold tracking-tight text-foreground">
                    {activity.name}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {activity.description ||
                      locale.organizationActivities.noDescription}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {projectName}
                  </div>
                </div>
                <Link
                  to="/projects/$projectId/activities/$activityId/overview"
                  params={{ projectId, activityId: activity.id }}
                  className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium"
                >
                  {locale.organizationActivities.openActivity}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
