import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ProjectAiKnowledgeContent } from "@/components/projectAiKnowledgeContent";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import { useProjectAiKnowledgeQuery } from "@/hooks/useWorkspaceQueries";
import { Card } from "@/components/workspaceUI";
import { useRequireAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/projects/$projectId/insights")({
  component: ProjectInsightsPage,
});

function ProjectInsightsPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const workspaceProject = useCurrentWorkspaceProject();
  const knowledgeQuery = useProjectAiKnowledgeQuery(
    projectId,
    Boolean(auth.token),
  );

  if (!auth.token || auth.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectInsights.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

  return (
    <ProjectWorkspaceShell description={t("projectInsights.description")}>
      {knowledgeQuery.isLoading ? (
        <Card className="p-6 text-sm text-muted-foreground">
          {t("projectInsights.loading")}
        </Card>
      ) : knowledgeQuery.isError || !knowledgeQuery.data ? (
        <EmptyStateCard
          title={t("projectInsights.notReadyTitle")}
          description={t("projectInsights.notReadyDescription", {
            count: workspaceProject?.activities.length ?? 0,
          })}
          ctaLabel={t("projectInsights.notReadyCta")}
          projectId={projectId}
        />
      ) : (
        <Card className="border-border/70 p-6">
          <ProjectAiKnowledgeContent knowledge={knowledgeQuery.data} />
        </Card>
      )}
    </ProjectWorkspaceShell>
  );
}

function EmptyStateCard({
  title,
  description,
  ctaLabel,
  projectId,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  projectId: string;
}) {
  return (
    <Card className="border-primary/15 bg-primary-soft/25 p-8">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        <Link
          to="/projects/$projectId/interpretation"
          params={{ projectId }}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {ctaLabel}
        </Link>
      </div>
    </Card>
  );
}
