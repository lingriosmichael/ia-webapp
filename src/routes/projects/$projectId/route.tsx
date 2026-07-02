import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/WorkspaceUI';
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
      organizationPermissions={workspaceQuery.data.organization.permissions}
      organizationLogoUrl={workspaceQuery.data.organization.logoUrl}
      userName={auth.data?.user.fullName ?? auth.data?.user.email ?? 'Account'}
      projects={workspaceQuery.data.projects}
      currentProjectId={projectId}
      onLogout={logout}
    >
      {projectQuery.data.permissions.canEdit ? null : (
        <div className="px-8 pt-8">
          <Card className="border-primary/20 bg-primary-soft/40 px-5 py-4 shadow-none">
            <div className="text-sm font-semibold text-primary">
              {t('project.readOnlyBannerTitle')}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('project.readOnlyBannerDescription', {
                owner: projectQuery.data.ownerName ?? t('project.unknownOwner'),
              })}
            </p>
          </Card>
        </div>
      )}
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
