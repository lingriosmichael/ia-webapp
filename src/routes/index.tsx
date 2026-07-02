import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Building2, FolderKanban, Layers } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicSiteHeader } from '@/components/PublicSiteHeader';
import { useSessionQuery } from '@/hooks/use-auth';
import { resolveActiveOrganizationId } from '@/lib/organization-selection';
import { resolveWorkspaceDestination } from '@/lib/workspace-routing';
import { getAccessToken } from '@/services/auth-storage';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();
  const token = getAccessToken();
  const activeOrganizationId = resolveActiveOrganizationId(
    sessionQuery.data?.organizations ?? [],
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (sessionQuery.isLoading) {
      return;
    }

    if (!sessionQuery.data?.organizations.length) {
      void navigate({ to: '/onboarding/workspace' });
      return;
    }

    if (!activeOrganizationId) {
      return;
    }

    let cancelled = false;

    async function redirectToWorkspace() {
      const destination = await resolveWorkspaceDestination(activeOrganizationId);
      if (!cancelled) {
        void navigate(destination);
      }
    }

    void redirectToWorkspace();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId, navigate, sessionQuery.data?.organizations.length, sessionQuery.isLoading, token]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(197,132,24,0.16),_transparent_22%),linear-gradient(180deg,_#fbf7ee_0%,_#f4efe6_44%,_#ffffff_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PublicSiteHeader currentPage="landing" />

        <section className="grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm text-primary shadow-[var(--shadow-soft)]">
              {t('landing.badge')}
            </div>
            <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {t('landing.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {t('landing.description')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                {t('landing.createWorkspace')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex h-10 items-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                {t('landing.useExistingAccount')}
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-card/82 p-6 shadow-[var(--shadow-elevated)] backdrop-blur">
            <div className="grid gap-4">
              <FeatureCard icon={<Building2 className="h-5 w-5 text-primary" />} title={t('landing.features.organizations.title')} description={t('landing.features.organizations.description')} />
              <FeatureCard icon={<FolderKanban className="h-5 w-5 text-primary" />} title={t('landing.features.projects.title')} description={t('landing.features.projects.description')} />
              <FeatureCard icon={<Layers className="h-5 w-5 text-primary" />} title={t('landing.features.activities.title')} description={t('landing.features.activities.description')} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
      {icon}
      <div className="mt-3 text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
