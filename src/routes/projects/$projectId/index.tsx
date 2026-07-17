import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Pencil, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectSettingsPanel } from "@/components/projectSettingsPanel";
import { Button } from "@/components/ui/button";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card, Stat } from "@/components/workspaceUI";
import { useWorkspaceShell } from "@/components/workspaceShell";
import { useProjectWorkspacePage } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import { useProjectOverviewQuery } from "@/hooks/useWorkspaceQueries";
import { resolveProjectSummaryText } from "@/lib/projectSummary";
import { formatDateTime } from "@/lib/translationUtils";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import type {
  ProjectOverview,
  ProjectRecentActivityItem,
} from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectOverviewPage,
});

function ProjectOverviewPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const locale = useWorkspaceLocale();
  const { openProjectDeleteDialog } = useWorkspaceShell();
  const { project } = useProjectWorkspacePage();
  const overviewQuery = useProjectOverviewQuery(projectId, Boolean(auth.token));
  const [isEditing, setIsEditing] = useState(false);
  const projectDescription =
    resolveProjectSummaryText({
      impactModel: project.impactModel,
      successIndicators: project.successIndicators,
    }) ?? locale.projectSettings.generalDescription;

  useEffect(() => {
    setIsEditing(false);
  }, [project.id, project.updatedAt]);

  if (!auth.token || auth.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <CenteredState label={locale.project.loading} />
      </ProjectWorkspaceShell>
    );
  }

  return (
    <ProjectWorkspaceShell
      description={!isEditing ? projectDescription : undefined}
      actions={
        project.permissions.canEdit ? (
          isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              {locale.projectSettings.cancelEditAction}
            </Button>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
              {locale.projectSettings.editAction}
            </Button>
          )
        ) : undefined
      }
    >
      <section className="space-y-6">
        {overviewQuery.data ? (
          <ProjectOverviewSummary overview={overviewQuery.data} />
        ) : null}
        <ProjectSettingsPanel
          project={project}
          isEditing={isEditing}
          onCancelEditing={() => setIsEditing(false)}
          onDeleteProject={() =>
            openProjectDeleteDialog({
              id: project.id,
              name: project.name,
              organizationId: project.organizationId,
            })
          }
        />
      </section>
    </ProjectWorkspaceShell>
  );
}

function ProjectOverviewSummary({ overview }: { overview: ProjectOverview }) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label={t("project.stats.activities")}
          value={String(overview.metrics.activityCount)}
          delta={t("project.stats.activitiesDelta")}
        />
        <Stat
          label={t("project.stats.uploads")}
          value={String(overview.metrics.uploadedDatasetCount)}
          delta={t("project.stats.uploadsDelta")}
        />
        <Stat
          label={t("project.dashboard.insightsGenerated")}
          value={String(overview.metrics.insightCount)}
          delta={
            overview.metrics.insightCount > 0
              ? t("project.dashboard.insightsReadyDelta")
              : t("project.dashboard.noInsightsDelta")
          }
          accent={overview.metrics.insightCount > 0}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("project.dashboard.whatNeedsAttention")}
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {describeAiKnowledgeWorkflow(overview, t)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            {t("project.dashboard.recentActivity")}
          </div>
          {overview.recentActivity.length === 0 ? (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("project.dashboard.noRecentActivity")}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {overview.recentActivity.slice(0, 4).map((item) => (
                <RecentActivityRow
                  key={item.id}
                  item={item}
                  language={i18n.language}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function describeAiKnowledgeWorkflow(
  overview: ProjectOverview,
  t: ReturnType<typeof useTranslation>["t"],
) {
  const missingEvidenceCount =
    overview.metrics.activityCount -
    overview.metrics.activitiesWithDatasetsCount;

  if (overview.metrics.failedJobCount > 0) {
    return t("project.dashboard.attentionItems.failedJobs", {
      count: overview.metrics.failedJobCount,
    });
  }

  if (overview.metrics.pendingInsightCount > 0) {
    return t("project.dashboard.attentionItems.pendingInsights", {
      count: overview.metrics.pendingInsightCount,
    });
  }

  if (overview.metrics.uploadedDatasetCount === 0) {
    return t("project.dashboard.attentionItems.noEvidence");
  }

  if (missingEvidenceCount > 0) {
    return t("project.dashboard.attentionItems.partialEvidence", {
      count: missingEvidenceCount,
    });
  }

  return t("project.dashboard.attentionItems.healthy");
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
    ? ` ${t("project.dashboard.recentActivityActivitySuffix", {
        name: item.activityName,
      })}`
    : "";

  return (
    <div className="rounded-[12px] border border-border/70 bg-secondary/20 p-4">
      <div className="text-sm font-medium text-foreground">
        {t(`project.dashboard.recentActivityTypes.${item.type}`)}
        {activitySuffix}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {formatDateTime(item.occurredAt, language)}
      </div>
    </div>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
