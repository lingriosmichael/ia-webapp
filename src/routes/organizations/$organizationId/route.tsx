import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useEffect } from "react";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { useLogout, useRequireAuth } from "@/hooks/use-auth";
import { useOrganizationWorkspaceQuery } from "@/hooks/use-grantready";
import { resolveActiveOrganizationId } from "@/lib/organization-selection";
import { resolveWorkspaceDestination } from "@/lib/workspace-routing";

interface OrganizationWorkspacePageContextValue {
  organizationId: string;
  userName: string;
  workspace: NonNullable<ReturnType<typeof useOrganizationWorkspaceQuery>["data"]>;
}

const OrganizationWorkspacePageContext =
  createContext<OrganizationWorkspacePageContextValue | null>(null);

export const Route = createFileRoute("/organizations/$organizationId")({
  component: OrganizationLayout,
});

export function useOrganizationWorkspacePage() {
  const context = useContext(OrganizationWorkspacePageContext);

  if (!context) {
    throw new Error("useOrganizationWorkspacePage must be used within the organization layout.");
  }

  return context;
}

function OrganizationLayout() {
  const { organizationId } = Route.useParams();
  const navigate = useNavigate();
  const logout = useLogout();
  const auth = useRequireAuth();
  const workspaceQuery = useOrganizationWorkspaceQuery(
    organizationId,
    Boolean(auth.token),
  );

  useEffect(() => {
    if (!auth.data?.organizations.length) {
      return;
    }

    const activeOrganizationId = resolveActiveOrganizationId(
      auth.data.organizations,
      organizationId,
    );

    if (!activeOrganizationId || activeOrganizationId === organizationId) {
      return;
    }

    void resolveWorkspaceDestination(activeOrganizationId).then((destination) =>
      navigate(destination),
    );
  }, [auth.data?.organizations, navigate, organizationId]);

  if (!auth.token || auth.isLoading || workspaceQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }

  if (!workspaceQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Workspace could not be loaded.
      </div>
    );
  }

  const userName = auth.data?.user.fullName ?? auth.data?.user.email ?? "Account";

  return (
    <OrganizationWorkspacePageContext.Provider
      value={{
        organizationId,
        userName,
        workspace: workspaceQuery.data,
      }}
    >
      <WorkspaceShell
        organizationId={workspaceQuery.data.organization.id}
        organizationName={workspaceQuery.data.organization.name}
        organizationRole={workspaceQuery.data.organization.role}
        organizationPermissions={workspaceQuery.data.organization.permissions}
        organizationLogoUrl={workspaceQuery.data.organization.logoUrl}
        userName={userName}
        projects={workspaceQuery.data.projects}
        onLogout={logout}
      >
        <Outlet />
      </WorkspaceShell>
    </OrganizationWorkspacePageContext.Provider>
  );
}
