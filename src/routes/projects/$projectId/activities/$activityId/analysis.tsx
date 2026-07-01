import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, CheckCircle2, Database, FileSpreadsheet, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityTabs } from '@/components/ActivityTabs';
import { Card, PageHeader, TopBar } from '@/components/WorkspaceUI';
import { useRequireAuth } from '@/hooks/use-auth';
import {
  useActivityJobsQuery,
  useActivityQuery,
  useActivityResultsQuery,
  useActivityUploadsQuery,
  useProjectQuery,
} from '@/hooks/use-grantready';
import { datasetOverview, getKeyMetrics, getSchema } from '@/lib/mock-data';

export const Route = createFileRoute('/projects/$projectId/activities/$activityId/analysis')({
  component: ActivityAnalyticsPage,
});

function ActivityAnalyticsPage() {
  const { projectId, activityId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
  const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
  const resultsQuery = useActivityResultsQuery(activityId, Boolean(auth.token));
  const { t } = useTranslation();

  if (
    !auth.token ||
    projectQuery.isLoading ||
    activityQuery.isLoading ||
    uploadsQuery.isLoading ||
    jobsQuery.isLoading ||
    resultsQuery.isLoading
  ) {
    return <CenteredState label={t('activityAnalytics.loading')} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <CenteredState label={t('activityAnalytics.loadFailed')} />;
  }

  const project = projectQuery.data;
  const activity = activityQuery.data;
  const uploads = uploadsQuery.data ?? [];
  const jobs = jobsQuery.data ?? [];
  const results = resultsQuery.data ?? [];
  const unresolvedReviewCount = getSchema(t).filter(
    (column) => column.clarifyingQuestion || column.confidence < 0.8,
  ).length;
  const hasDataset = uploads.length > 0;
  const isProcessing = jobs.some((job) => ['queued', 'processing'].includes(job.status));
  const analysisReady = hasDataset && !isProcessing;
  const insightsAvailable = results.filter((result) => result.status === 'available').length;
  const keyMetrics = getKeyMetrics(t).slice(0, 4);
  const storyPointsValue = t('activityAnalytics.storyPoints', { returnObjects: true });
  const storyPoints = Array.isArray(storyPointsValue) ? storyPointsValue : [];

  return (
    <>
      <TopBar
        crumbs={[
          { label: project.name, to: '/projects/$projectId', params: { projectId } },
          { label: activity.name },
          { label: t('activityAnalytics.crumb') },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={t('activityAnalytics.eyebrow')}
          title={t('activityAnalytics.title')}
          description={t('activityAnalytics.description')}
        />
        <ActivityTabs projectId={projectId} activityId={activityId} className="mt-6" />

        {!hasDataset ? (
            <WorkflowGate
              title={t('activityAnalytics.gates.noDataset.title')}
              description={t('activityAnalytics.gates.noDataset.description')}
              to="/projects/$projectId/activities/$activityId/overview"
              params={{ projectId, activityId }}
              cta={t('activityAnalytics.gates.noDataset.cta')}
            />
        ) : isProcessing ? (
            <WorkflowGate
              title={t('activityAnalytics.gates.processing.title')}
              description={t('activityAnalytics.gates.processing.description')}
              to="/projects/$projectId/activities/$activityId/overview"
              params={{ projectId, activityId }}
              cta={t('activityAnalytics.gates.processing.cta')}
            />
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <MiniCard
                icon={<Database className="h-4 w-4 text-primary" />}
                label={t('activityAnalytics.summary.rows')}
                value={String(datasetOverview.rows)}
              />
              <MiniCard
                icon={<FileSpreadsheet className="h-4 w-4 text-primary" />}
                label={t('activityAnalytics.summary.columns')}
                value={String(datasetOverview.columns)}
              />
              <MiniCard
                icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
                label={t('activityAnalytics.summary.review')}
                value={t('activityAnalytics.summary.reviewValue', {
                  count: unresolvedReviewCount,
                })}
              />
              <MiniCard
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                label={t('activityAnalytics.summary.insights')}
                value={t('activityAnalytics.summary.insightsValue', {
                  count: insightsAvailable,
                })}
              />
            </div>

            <Card className="mt-6 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <BarChart3 className="h-4 w-4 text-primary" />
                {t('activityAnalytics.metricsTitle')}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {keyMetrics.map((metric) => (
                  <div key={metric.key} className="rounded-xl border border-border bg-secondary/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {metric.label}
                    </div>
                    <div className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                      {metric.value}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{metric.delta}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <Card className="p-6">
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  {t('activityAnalytics.storyTitle')}
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {storyPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  {t('activityAnalytics.nextActionTitle')}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {analysisReady
                    ? t('activityAnalytics.nextActionReady')
                    : t('activityAnalytics.nextActionBlocked')}
                </p>
                <Link
                  to={
                    unresolvedReviewCount > 0
                      ? '/projects/$projectId/activities/$activityId/data-review'
                      : '/projects/$projectId/activities/$activityId/insights'
                  }
                  params={{ projectId, activityId }}
                  className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  {unresolvedReviewCount > 0
                    ? t('activityAnalytics.reviewDataCta')
                    : t('activityAnalytics.openInsightsCta')}
                </Link>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function WorkflowGate({
  title,
  description,
  to,
  params,
  cta,
}: {
  title: string;
  description: string;
  to: '/projects/$projectId/activities/$activityId/overview';
  params: { projectId: string; activityId: string };
  cta: string;
}) {
  return (
    <Card className="mt-6 border-primary/15 bg-primary-soft/25 p-8">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold tracking-tight text-foreground">{title}</div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
        <Link
          to={to}
          params={params}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {cta}
        </Link>
      </div>
    </Card>
  );
}

function MiniCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold tracking-tight capitalize">{value}</div>
    </Card>
  );
}

function CenteredState({ label }: { label: string }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{label}</div>;
}
