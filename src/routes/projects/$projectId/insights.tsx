import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import { useProjectOverviewQuery } from "@/hooks/useGrantready";
import { useRequireAuth } from "@/hooks/useAuth";
import { getProjectInsights } from "@/lib/mockData";

export const Route = createFileRoute("/projects/$projectId/insights")({
  component: ProjectInsightsPage,
});

function ProjectInsightsPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const overviewQuery = useProjectOverviewQuery(projectId, Boolean(auth.token));

  if (!auth.token || overviewQuery.isLoading || !overviewQuery.data) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectInsights.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  const isReady = overviewQuery.data.metrics.insightCount > 0;
  const insights = getProjectInsights(t);

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          {t("projectWorkspace.insights.title")}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.insights.description")}
        </p>

        {!isReady ? (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t("projectWorkspace.insights.notReadyTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t("projectWorkspace.insights.notReadyDescription")}
            </p>
          </Card>
        ) : (
          <>
            <Card className="mt-6 border-primary/15 bg-gradient-to-br from-primary-soft to-card p-6">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {t("projectWorkspace.insights.executiveSummary")}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground">
                {insights.executiveSummary}
              </p>
            </Card>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Section
                icon={<TrendingUp className="h-4 w-4" />}
                title={t("projectInsights.keyFindingsTitle")}
                items={insights.keyFindings}
              />
              <Section
                icon={<AlertCircle className="h-4 w-4" />}
                title={t("projectInsights.evidenceGapsTitle")}
                items={insights.evidenceGaps}
              />
              <Section
                icon={<Lightbulb className="h-4 w-4" />}
                title={t("projectInsights.recommendationsTitle")}
                items={insights.recommendations}
              />
              <Section
                icon={<Sparkles className="h-4 w-4" />}
                title={t("projectWorkspace.insights.nextSteps")}
                items={insights.interestingPatterns}
              />
            </div>
          </>
        )}
      </section>
    </ProjectWorkspaceShell>
  );
}

function Section({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
          {icon}
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/40 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
