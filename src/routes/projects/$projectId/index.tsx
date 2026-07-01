import { createFileRoute, Link } from '@tanstack/react-router';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Layers,
  LayoutGrid,
  Sparkles,
  Upload as UploadIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, PageHeader, TopBar } from '@/components/WorkspaceUI';
import { useWorkspaceShell } from '@/components/WorkspaceShell';
import { useRequireAuth } from '@/hooks/use-auth';
import { useProjectOverviewQuery } from '@/hooks/use-grantready';
import { formatDateTime, translateStatus } from '@/lib/translation-utils';
import type { ProjectOverviewMetrics, ProjectRecentActivityItem, WorkspaceActivity } from '@/services/api-client';

export const Route = createFileRoute('/projects/$projectId/')({
  component: ProjectOverview,
});

function ProjectOverview() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const overviewQuery = useProjectOverviewQuery(projectId, Boolean(auth.token));
  const { i18n, t } = useTranslation();
  const { openActivityDialog } = useWorkspaceShell();

  if (!auth.token || auth.isLoading || overviewQuery.isLoading) {
    return <CenteredState label={t('project.loading')} />;
  }

  if (!overviewQuery.data) {
    return <CenteredState label={t('project.loadFailed')} />;
  }

  const { project, activities, metrics, recentActivity } = overviewQuery.data;
  const hasActivities = activities.length > 0;
  const evidenceCompletenessPercent =
    metrics.activityCount === 0
      ? 0
      : Math.round((metrics.activitiesWithDatasetsCount / metrics.activityCount) * 100);

  const healthState = deriveHealthState(metrics);
  const healthLabel = t(`project.dashboard.healthStates.${healthState.key}`);
  const healthDescription = t(`project.dashboard.healthDescriptions.${healthState.key}`);
  const attentionItems = buildAttentionItems(metrics, t);

  function renderHeaderActions() {
    if (!hasActivities) {
      return null;
    }

    return (
      <>
        <button
          type="button"
          onClick={() => openActivityDialog(projectId)}
          className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          {t('project.addActivity')}
        </button>
        <Link
          to="/projects/$projectId/insights"
          params={{ projectId }}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" />
          {t('project.viewInsights')}
        </Link>
      </>
    );
  }

  return (
    <>
      <TopBar
        crumbs={[
          {
            label: t('project.crumbsOrganization'),
            to: '/organizations/$organizationId',
            params: { organizationId: project.organizationId },
          },
          { label: project.name },
        ]}
      />

      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={t('project.eyebrow')}
          title={project.name}
          description={project.description ?? t('project.noDescription')}
          actions={renderHeaderActions()}
        />

        {!hasActivities ? (
          <Card className="mt-8 overflow-hidden border-primary/15 bg-primary-soft/30 p-8 sm:p-10">
            <div className="max-w-3xl">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-[var(--shadow-soft)]">
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
                {t('project.emptyStateTitle', { name: project.name })}
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground/85">
                {t('project.emptyStateDescription')}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {t('project.emptyStateSupporting')}
              </p>
              <button
                type="button"
                onClick={() => openActivityDialog(projectId)}
                className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {t('project.emptyStateAction')}
              </button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewMetricCard
                icon={
                  healthState.key === 'strong' ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : healthState.key === 'progress' ? (
                    <Clock3 className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-primary" />
                  )
                }
                label={t('project.dashboard.health')}
                value={healthLabel}
                description={healthDescription}
                accent
              />
              <OverviewMetricCard
                icon={<Layers className="h-4 w-4 text-primary" />}
                label={t('project.dashboard.evidenceCompleteness')}
                value={t('project.dashboard.completenessValue', {
                  withEvidence: metrics.activitiesWithDatasetsCount,
                  total: metrics.activityCount,
                })}
                description={t('project.dashboard.completenessDelta', {
                  percent: evidenceCompletenessPercent,
                })}
              />
              <OverviewMetricCard
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                label={t('project.dashboard.insightsGenerated')}
                value={String(metrics.insightCount)}
                description={
                  metrics.pendingInsightCount > 0
                    ? t('project.dashboard.insightsDelta', {
                        count: metrics.pendingInsightCount,
                      })
                    : metrics.insightCount > 0
                      ? t('project.dashboard.insightsReadyDelta')
                      : t('project.dashboard.noInsightsDelta')
                }
              />
              <OverviewMetricCard
                icon={<UploadIcon className="h-4 w-4 text-primary" />}
                label={t('project.dashboard.lastEvidenceUpload')}
                value={
                  metrics.lastUploadAt
                    ? formatDateTime(metrics.lastUploadAt, i18n.language)
                    : t('project.dashboard.noUploadValue')
                }
                description={
                  metrics.lastUploadAt
                    ? t('project.stats.lastUpdatedDelta')
                    : t('project.dashboard.noUploadDelta')
                }
              />
            </div>

            <Card className="mt-6 p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold tracking-tight">
                    {t('project.dashboard.whatNeedsAttention')}
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {attentionItems.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight">
                  {t('project.activitiesHeading')}
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {t('project.activitiesDescription')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openActivityDialog(projectId)}
                className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {t('project.addAnotherActivity')}
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ProjectActivityCard
                  key={activity.id}
                  activity={activity}
                  projectId={projectId}
                />
              ))}
            </div>

            <Card className="mt-10 p-6">
              <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
                <Clock3 className="h-4 w-4 text-primary" />
                {t('project.dashboard.recentActivity')}
              </div>
              {recentActivity.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t('project.dashboard.noRecentActivity')}
                </p>
              ) : (
                <div className="mt-5 grid gap-4">
                  {recentActivity.map((item) => (
                    <RecentActivityRow
                      key={item.id}
                      item={item}
                      language={i18n.language}
                    />
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
}

function OverviewMetricCard({
  icon,
  label,
  value,
  description,
  accent = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className={`mt-3 text-xl font-semibold tracking-tight ${accent ? 'text-primary' : 'text-foreground'}`}
      >
        {value}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}

function ProjectActivityCard({
  activity,
  projectId,
}: {
  activity: WorkspaceActivity;
  projectId: string;
}) {
  const { t } = useTranslation();

  return (
    <Card className="group flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
          <Database className="h-4 w-4" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium capitalize text-foreground">
          {translateStatus(t, activity.status)}
        </span>
      </div>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{activity.name}</h3>
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
        {activity.description ?? t('project.noActivityDescription')}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
          {activity.uploadMetadataCount} {t('project.stats.uploads').toLowerCase()}
        </span>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
          {activity.resultCount} {t('project.dashboard.insightsGenerated').toLowerCase()}
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-[12px]">
        <Link
          to="/projects/$projectId/activities/$activityId/overview"
          params={{ projectId, activityId: activity.id }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-foreground hover:bg-secondary"
        >
          <FileText className="h-3.5 w-3.5" /> {t('project.brief')}
        </Link>
        <Link
          to="/projects/$projectId/activities/$activityId/data-review"
          params={{ projectId, activityId: activity.id }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-foreground hover:bg-secondary"
        >
          <LayoutGrid className="h-3.5 w-3.5" /> {t('activityTabs.schema')}
        </Link>
        <Link
          to="/projects/$projectId/activities/$activityId/analysis"
          params={{ projectId, activityId: activity.id }}
          className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
        >
          {t('project.open')} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

function RecentActivityRow({
  item,
  language,
}: {
  item: ProjectRecentActivityItem;
  language: string;
}) {
  const { t } = useTranslation();
  const activitySuffix = item.activityName
    ? ` ${t('project.dashboard.recentActivityActivitySuffix', {
        name: item.activityName,
      })}`
    : '';

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
      <div>
        <div className="text-sm font-medium text-foreground">
          {t(`project.dashboard.recentActivityTypes.${item.type}`)}
          {activitySuffix}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {formatDateTime(item.occurredAt, language)}
      </div>
    </div>
  );
}

function deriveHealthState(metrics: ProjectOverviewMetrics) {
  if (
    metrics.uploadedDatasetCount > 0 &&
    metrics.failedJobCount === 0 &&
    metrics.insightCount > 0
  ) {
    return { key: 'strong' as const };
  }

  if (
    metrics.uploadedDatasetCount > 0 &&
    (metrics.pendingInsightCount > 0 || metrics.activitiesWithDatasetsCount > 0)
  ) {
    return { key: 'progress' as const };
  }

  return { key: 'attention' as const };
}

function buildAttentionItems(
  metrics: ProjectOverviewMetrics,
  t: ReturnType<typeof useTranslation>['t'],
) {
  const items: string[] = [];

  if (metrics.uploadedDatasetCount === 0) {
    items.push(t('project.dashboard.attentionItems.noEvidence'));
  }

  const activitiesWithoutEvidence =
    metrics.activityCount - metrics.activitiesWithDatasetsCount;
  if (activitiesWithoutEvidence > 0) {
    items.push(
      t('project.dashboard.attentionItems.partialEvidence', {
        count: activitiesWithoutEvidence,
      }),
    );
  }

  if (metrics.pendingInsightCount > 0) {
    items.push(
      t('project.dashboard.attentionItems.pendingInsights', {
        count: metrics.pendingInsightCount,
      }),
    );
  }

  if (metrics.failedJobCount > 0) {
    items.push(
      t('project.dashboard.attentionItems.failedJobs', {
        count: metrics.failedJobCount,
      }),
    );
  }

  if (items.length === 0) {
    items.push(t('project.dashboard.attentionItems.healthy'));
  }

  return items;
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
