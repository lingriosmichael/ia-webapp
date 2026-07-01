import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle, Lightbulb, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, PageHeader, TopBar } from '@/components/WorkspaceUI';
import { useRequireAuth } from '@/hooks/use-auth';
import { useProjectActivitiesQuery, useProjectQuery } from '@/hooks/use-grantready';
import { getProjectInsights } from '@/lib/mock-data';

export const Route = createFileRoute('/projects/$projectId/insights')({
  component: ProjectInsights,
});

function ProjectInsights() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activitiesQuery = useProjectActivitiesQuery(projectId, Boolean(auth.token));
  const { t } = useTranslation();

  if (!auth.token || projectQuery.isLoading || activitiesQuery.isLoading) {
    return <CenteredState label={t('projectInsights.loading')} />;
  }

  if (!projectQuery.data || !activitiesQuery.data) {
    return <CenteredState label={t('projectInsights.loadFailed')} />;
  }

  const project = projectQuery.data;
  const activities = activitiesQuery.data;
  const projectInsights = getProjectInsights(t);

  return (
    <>
      <TopBar crumbs={[{ label: t('projectInsights.crumbsProjects') }, { label: project.name, to: '/projects/$projectId', params: { projectId } }, { label: t('projectInsights.crumbsInsights') }]} />
      <div className="mx-auto w-full max-w-5xl px-8 py-10">
        <PageHeader eyebrow={t('projectInsights.eyebrow')} title={t('projectInsights.title')} description={t('projectInsights.description', { count: activities.length })} />
        <Card className="mt-8 border-primary/15 bg-gradient-to-br from-primary-soft to-card p-6"><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary"><Sparkles className="h-3.5 w-3.5" /> {t('projectInsights.executiveSummaryTitle')}</div><p className="mt-3 text-[15px] leading-relaxed text-foreground">{projectInsights.executiveSummary}</p></Card>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Section icon={<TrendingUp className="h-4 w-4" />} title={t('projectInsights.keyFindingsTitle')} items={projectInsights.keyFindings} tone="primary" />
          <Section icon={<Zap className="h-4 w-4" />} title={t('projectInsights.interestingPatternsTitle')} description={t('projectInsights.interestingPatternsDescription')} items={projectInsights.interestingPatterns} />
          <Section icon={<AlertCircle className="h-4 w-4" />} title={t('projectInsights.evidenceGapsTitle')} description={t('projectInsights.evidenceGapsDescription')} items={projectInsights.evidenceGaps} />
          <Section icon={<Lightbulb className="h-4 w-4" />} title={t('projectInsights.recommendationsTitle')} items={projectInsights.recommendations} />
        </div>
        <Card className="mt-6 border-success/30 bg-[oklch(0.98_0.02_155)] p-6"><div className="flex items-start gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-success/15 text-[oklch(0.4_0.12_155)]"><ShieldCheck className="h-4 w-4" /></div><div><h3 className="text-[15px] font-semibold tracking-tight">{t('projectInsights.privacyTitle')}</h3><p className="mt-0.5 text-[12px] text-muted-foreground">{t('projectInsights.privacyDescription')}</p></div></div><ul className="mt-5 grid gap-2.5 md:grid-cols-3">{projectInsights.privacy.map((item, index) => <li key={index} className="rounded-lg border border-success/20 bg-card px-3.5 py-3 text-[12.5px] leading-relaxed">{item}</li>)}</ul></Card>
      </div>
    </>
  );
}

function Section({ icon, title, description, items, tone = 'default' }: { icon: ReactNode; title: string; description?: string; items: string[]; tone?: 'default' | 'primary' }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${tone === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-primary-soft text-primary'}`}>{icon}</div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">{items.map((item, index) => <li key={index} className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/40 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" /><span>{item}</span></li>)}</ul>
    </Card>
  );
}

function CenteredState({ label }: { label: string }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{label}</div>;
}
