import { createFileRoute } from '@tanstack/react-router';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { getAttendanceDistribution, getCompletionByAgeGroup, confidenceImprovement, getKeyMetrics, getMentorMatching, trendsByWeek } from '@/lib/mockData';
import { Card, PageHeader, Stat, TopBar } from '@/components/workspaceUI';
import { useRequireAuth } from '@/hooks/useAuth';
import { useProjectActivitiesQuery, useProjectQuery } from '@/hooks/useGrantready';

export const Route = createFileRoute('/projects/$projectId/analytics')({
  component: ProjectAnalytics,
});

const COLORS = ['oklch(0.55 0.22 295)', 'oklch(0.65 0.18 250)', 'oklch(0.7 0.16 180)', 'oklch(0.75 0.16 90)', 'oklch(0.65 0.2 25)'];
const tooltipStyle = { background: 'oklch(1 0 0)', border: '1px solid oklch(0.93 0.005 280)', borderRadius: 8, fontSize: 12, padding: '8px 10px', boxShadow: '0 4px 12px -2px oklch(0 0 0 / 0.08)' };

function ProjectAnalytics() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activitiesQuery = useProjectActivitiesQuery(projectId, Boolean(auth.token));
  const { t } = useTranslation();

  if (!auth.token || projectQuery.isLoading || activitiesQuery.isLoading) {
    return <CenteredState label={t('projectAnalytics.loading')} />;
  }

  if (!projectQuery.data || !activitiesQuery.data) {
    return <CenteredState label={t('projectAnalytics.loadFailed')} />;
  }

  const project = projectQuery.data;
  const activities = activitiesQuery.data;
  const keyMetrics = getKeyMetrics(t);
  const attendanceDistribution = getAttendanceDistribution();
  const completionByAgeGroup = getCompletionByAgeGroup();
  const mentorMatching = getMentorMatching(t);

  return (
    <>
      <TopBar crumbs={[{ label: t('projectAnalytics.crumbsProjects') }, { label: project.name, to: '/projects/$projectId', params: { projectId } }, { label: t('projectAnalytics.crumbsAnalytics') }]} />
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader eyebrow={t('projectAnalytics.eyebrow')} title={t('projectAnalytics.title')} description={t('projectAnalytics.description', { count: activities.length })} />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {keyMetrics.map((metric) => <Stat key={metric.key} label={metric.label} value={metric.value} delta={metric.delta} />)}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <ChartCard title={t('projectAnalytics.charts.attendanceTrend')} subtitle={t('projectAnalytics.charts.mockDataset')}><ResponsiveContainer><AreaChart data={trendsByWeek}><defs><linearGradient id="att" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.4} /><stop offset="100%" stopColor={COLORS[0]} stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="oklch(0.93 0.005 280)" vertical={false} /><XAxis dataKey="week" stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="attendance" name={t('projectAnalytics.series.attendance')} stroke={COLORS[0]} strokeWidth={2} fill="url(#att)" /></AreaChart></ResponsiveContainer></ChartCard>
          <ChartCard title={t('projectAnalytics.charts.confidenceImprovement')} subtitle={t('projectAnalytics.charts.mockDataset')}><ResponsiveContainer><LineChart data={confidenceImprovement}><CartesianGrid stroke="oklch(0.93 0.005 280)" vertical={false} /><XAxis dataKey="week" stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><YAxis domain={[3, 7]} stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="pre" name={t('projectAnalytics.series.preConfidence')} stroke={COLORS[1]} strokeWidth={2} dot={false} strokeDasharray="4 4" /><Line dataKey="post" name={t('projectAnalytics.series.postConfidence')} stroke={COLORS[0]} strokeWidth={2.5} dot={{ r: 3, fill: COLORS[0] }} /></LineChart></ResponsiveContainer></ChartCard>
          <ChartCard title={t('projectAnalytics.charts.attendanceDistribution')}><ResponsiveContainer><BarChart data={attendanceDistribution}><CartesianGrid stroke="oklch(0.93 0.005 280)" vertical={false} /><XAxis dataKey="bucket" stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" name={t('projectAnalytics.series.count')} fill={COLORS[0]} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
          <ChartCard title={t('projectAnalytics.charts.completionByAgeGroup')}><ResponsiveContainer><BarChart data={completionByAgeGroup} stackOffset="expand"><CartesianGrid stroke="oklch(0.93 0.005 280)" vertical={false} /><XAxis dataKey="group" stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="completed" name={t('projectAnalytics.series.completed')} stackId="a" fill={COLORS[0]} radius={[6, 6, 0, 0]} /><Bar dataKey="dropped" name={t('projectAnalytics.series.dropped')} stackId="a" fill="oklch(0.88 0.02 280)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
          <ChartCard title={t('projectAnalytics.charts.mentorMatching')}><ResponsiveContainer><PieChart><Tooltip contentStyle={tooltipStyle} /><Pie data={mentorMatching} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>{mentorMatching.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}</Pie></PieChart></ResponsiveContainer><div className="mt-2 flex justify-center gap-4 text-[11px]">{mentorMatching.map((item, index) => <span key={item.name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[index] }} />{item.name}</span>)}</div></ChartCard>
          <Card className="p-5"><h3 className="text-[14px] font-semibold tracking-tight">{t('projectAnalytics.charts.backendStatus')}</h3><ul className="mt-4 space-y-3 text-[13px]"><li className="flex items-center justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">{t('projectAnalytics.backendStatus.projectLoaded')}</span><span className="font-medium">{t('projectAnalytics.backendStatus.yes')}</span></li><li className="flex items-center justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">{t('projectAnalytics.backendStatus.activitiesLoaded')}</span><span className="font-medium">{activities.length}</span></li><li className="flex items-center justify-between"><span className="text-muted-foreground">{t('projectAnalytics.backendStatus.aiAnalytics')}</span><span className="font-medium">{t('projectAnalytics.backendStatus.notImplemented')}</span></li></ul></Card>
        </div>
      </div>
    </>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return <Card className="p-5"><div className="flex items-baseline justify-between"><h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>{subtitle && <span className="text-[11px] text-muted-foreground">{subtitle}</span>}</div><div className="mt-4 h-64">{children}</div></Card>;
}

function CenteredState({ label }: { label: string }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{label}</div>;
}
