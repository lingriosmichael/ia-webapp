import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { OrganizationSettingsPanel } from '@/components/OrganizationSettingsPanel';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PageHeader, TopBar } from '@/components/WorkspaceUI';
import { useLogout, useRequireAuth } from '@/hooks/use-auth';
import { useOrganizationWorkspaceQuery } from '@/hooks/use-grantready';
import { useWorkspaceLocale } from '@/hooks/use-workspace-locale';

export const Route = createFileRoute('/organizations/$organizationId')({
  component: OrganizationSettingsPage,
});

function OrganizationSettingsPage() {
  const { organizationId } = Route.useParams();
  const logout = useLogout();
  const auth = useRequireAuth();
  const workspaceQuery = useOrganizationWorkspaceQuery(organizationId, Boolean(auth.token));
  const { t } = useTranslation();
  const locale = useWorkspaceLocale();

  if (!auth.token || auth.isLoading || workspaceQuery.isLoading) {
    return <CenteredState label={t('organization.loading')} />;
  }

  if (!workspaceQuery.data) {
    return <CenteredState label={t('organization.loadFailed')} />;
  }

  const workspace = workspaceQuery.data;

  return (
    <WorkspaceShell
      organizationId={workspace.organization.id}
      organizationName={workspace.organization.name}
      organizationRole={workspace.organization.role}
      organizationLogoUrl={workspace.organization.logoUrl}
      userName={auth.data?.user.fullName ?? auth.data?.user.email ?? 'Account'}
      projects={workspace.projects}
      onLogout={logout}
    >
      <TopBar
        crumbs={[
          { label: workspace.organization.name },
          { label: locale.sidebar.organizationSettings },
        ]}
        actions={
          <button
            type="button"
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"
            onClick={logout}
          >
            {t('common.logOut')}
          </button>
        }
      />

      <div className="mx-auto w-full max-w-5xl px-8 py-10">
        <PageHeader
          eyebrow={locale.organizationSettings.eyebrow}
          title={locale.organizationSettings.title}
          description={locale.organizationSettings.description}
        />
        <OrganizationSettingsPanel organization={workspace.organization} />
      </div>
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
