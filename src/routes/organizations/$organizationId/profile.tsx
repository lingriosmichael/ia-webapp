import { createFileRoute, Navigate } from "@tanstack/react-router";
import { OrganizationSettingsPanel } from "@/components/OrganizationSettingsPanel";
import { PageHeader, TopBar } from "@/components/WorkspaceUI";
import { useWorkspaceLocale } from "@/hooks/use-workspace-locale";
import { useOrganizationWorkspacePage } from "./route";

export const Route = createFileRoute("/organizations/$organizationId/profile")({
  component: OrganizationProfilePage,
});

function OrganizationProfilePage() {
  const { workspace } = useOrganizationWorkspacePage();
  const locale = useWorkspaceLocale();

  if (!workspace.organization.permissions.canManageProfile) {
    return <Navigate to="/organizations/$organizationId" params={{ organizationId: workspace.organization.id }} />;
  }

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.organization.name, to: "/organizations/$organizationId", params: { organizationId: workspace.organization.id } },
          { label: locale.sidebar.organizationProfile },
        ]}
      />

      <div className="mx-auto w-full max-w-5xl px-8 py-10">
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
