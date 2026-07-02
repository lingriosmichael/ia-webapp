import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useOrganizationWorkspacePage } from "./-organizationWorkspaceContext";

export const Route = createFileRoute("/organizations/$organizationId/settings")(
  {
    component: OrganizationSettingsPage,
  },
);

function OrganizationSettingsPage() {
  const { workspace } = useOrganizationWorkspacePage();
  const locale = useWorkspaceLocale();

  if (!workspace.organization.permissions.canManageSettings) {
    return (
      <Navigate
        to="/organizations/$organizationId"
        params={{ organizationId: workspace.organization.id }}
      />
    );
  }

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: workspace.organization.name,
            to: "/organizations/$organizationId",
            params: { organizationId: workspace.organization.id },
          },
          { label: locale.sidebar.organizationSettings },
        ]}
      />
      <div className="mx-auto w-full max-w-5xl px-8 py-10">
        <PageHeader
          eyebrow={locale.organizationSettings.settingsEyebrow}
          title={locale.organizationSettings.settingsTitle}
          description={locale.organizationSettings.settingsDescription}
        />
        <Card className="mt-8 p-6">
          <p className="text-sm leading-6 text-muted-foreground">
            {locale.organizationSettings.settingsPlaceholder}
          </p>
        </Card>
      </div>
    </>
  );
}
