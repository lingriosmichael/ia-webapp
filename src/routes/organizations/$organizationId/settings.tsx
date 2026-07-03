import { createFileRoute } from "@tanstack/react-router";
import { OrganizationSettingsPanel } from "@/components/organizationSettingsPanel";
import { PageHeader, TopBar } from "@/components/workspaceUI";
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
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={locale.organizationSettings.eyebrow}
          title={locale.organizationSettings.title}
          description={locale.organizationSettings.description}
        />
        <OrganizationSettingsPanel organization={workspace.organization} />
      </div>
    </>
  );
}
