import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import { useRequireAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/projects/$projectId/insights")({
  component: ProjectInsightsPage,
});

function ProjectInsightsPage() {
  const auth = useRequireAuth();
  const { t } = useTranslation();

  if (!auth.token) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectInsights.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

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

        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {t("projectWorkspace.insights.notReadyTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("projectWorkspace.insights.notReadyDescription")}
          </p>
        </Card>
      </section>
    </ProjectWorkspaceShell>
  );
}
