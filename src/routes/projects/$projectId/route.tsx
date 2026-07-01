import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useRequireAuth, useLogout } from '@/hooks/use-auth';
import { useOrganizationWorkspaceQuery, useProjectQuery } from '@/hooks/use-grantready';

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectLayout,
});

function ProjectLayout() {
  const { projectId } = Route.useParams();
  const logout = useLogout();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const workspaceQuery = useOrganizationWorkspaceQuery(projectQuery.data?.organizationId ?? '', Boolean(auth.token && projectQuery.data?.organizationId));
  const { t } = useTranslation();

  if (!auth.token || auth.isLoading || projectQuery.isLoading || workspaceQuery.isLoading) {
    return <CenteredState label={t('project.loading')} />;
  }

  if (!projectQuery.data || !workspaceQuery.data) {
    return <CenteredState label={t('project.loadFailed')} />;
  }

  return (
    <WorkspaceShell
      organizationId={workspaceQuery.data.organization.id}
      organizationName={workspaceQuery.data.organization.name}
      organizationRole={workspaceQuery.data.organization.role}
      organizationLogoUrl={workspaceQuery.data.organization.logoUrl}
      userName={auth.data?.user.fullName ?? auth.data?.user.email ?? 'Account'}
      projects={workspaceQuery.data.projects}
      currentProjectId={projectId}
      onLogout={logout}
    >
      <Outlet />
    </WorkspaceShell>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      {label}
    </div>
  );
}
