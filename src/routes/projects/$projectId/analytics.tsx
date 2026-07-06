import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card, Stat } from "@/components/workspaceUI";
import { useProjectOverviewQuery } from "@/hooks/useGrantready";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  getAttendanceDistribution,
  getKeyMetrics,
  trendsByWeek,
} from "@/lib/mockData";

export const Route = createFileRoute("/projects/$projectId/analytics")({
  component: ProjectAnalyticsPage,
});

const tooltipStyle = {
  background: "oklch(1 0 0)",
  border: "1px solid oklch(0.93 0.005 280)",
  borderRadius: 8,
  fontSize: 12,
  padding: "8px 10px",
};

function ProjectAnalyticsPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const overviewQuery = useProjectOverviewQuery(projectId, Boolean(auth.token));

  if (!auth.token || overviewQuery.isLoading || !overviewQuery.data) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  const metrics = overviewQuery.data.metrics;
  const isReady = metrics.activitiesWithDatasetsCount > 0;
  const stats = getKeyMetrics(t);
  const attendanceDistribution = getAttendanceDistribution();

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          {t("projectWorkspace.analytics.title")}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.analytics.description")}
        </p>

        {!isReady ? (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t("projectWorkspace.analytics.notReadyTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t("projectWorkspace.analytics.notReadyDescription")}
            </p>
          </Card>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {stats.map((metric) => (
                <Stat
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  delta={metric.delta}
                />
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <ChartCard title={t("projectAnalytics.charts.attendanceTrend")}>
                <ResponsiveContainer>
                  <AreaChart data={trendsByWeek}>
                    <defs>
                      <linearGradient id="project-attendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.55 0.22 295)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.55 0.22 295)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.93 0.005 280)" vertical={false} />
                    <XAxis dataKey="week" stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      name={t("projectAnalytics.series.attendance")}
                      stroke="oklch(0.55 0.22 295)"
                      strokeWidth={2}
                      fill="url(#project-attendance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title={t("projectAnalytics.charts.attendanceDistribution")}>
                <ResponsiveContainer>
                  <BarChart data={attendanceDistribution}>
                    <CartesianGrid stroke="oklch(0.93 0.005 280)" vertical={false} />
                    <XAxis dataKey="bucket" stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.55 0.015 280)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="count"
                      name={t("projectAnalytics.series.count")}
                      fill="oklch(0.55 0.22 295)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </section>
    </ProjectWorkspaceShell>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <div className="mt-4 h-72">{children}</div>
    </Card>
  );
}
