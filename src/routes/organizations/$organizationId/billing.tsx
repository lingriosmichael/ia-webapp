import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Card, PageHeader, TopBar } from "@/components/workspaceUI";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useOrganizationWorkspacePage } from "./route";

export const Route = createFileRoute("/organizations/$organizationId/billing")({
  component: OrganizationBillingPage,
});

function OrganizationBillingPage() {
  const { workspace } = useOrganizationWorkspacePage();
  const locale = useWorkspaceLocale();

  if (!workspace.organization.permissions.canManageBilling) {
    return <Navigate to="/organizations/$organizationId" params={{ organizationId: workspace.organization.id }} />;
  }

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.organization.name, to: "/organizations/$organizationId", params: { organizationId: workspace.organization.id } },
          { label: locale.sidebar.billing },
        ]}
      />
      <div className="mx-auto w-full max-w-5xl px-8 py-10">
        <PageHeader
          eyebrow={locale.organizationBilling.eyebrow}
          title={locale.organizationBilling.title}
          description={locale.organizationBilling.description}
        />
        <Card className="mt-8 p-6">
          <p className="text-sm leading-6 text-muted-foreground">
            {locale.organizationBilling.placeholder}
          </p>
        </Card>
      </div>
    </>
  );
}
