import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import { useRequireAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/projects/$projectId/analytics")({
  component: ProjectAnalyticsPage,
});

function ProjectAnalyticsPage() {
  const auth = useRequireAuth();
  const { t } = useTranslation();

  if (!auth.token) {
    return (
      <ProjectWorkspaceShell>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
          {t("projectAnalytics.loading")}
        </div>
      </ProjectWorkspaceShell>
    );
  }

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

        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {t("projectWorkspace.analytics.notReadyTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("projectWorkspace.analytics.notReadyDescription")}
          </p>
        </Card>
      </section>
    </ProjectWorkspaceShell>
  );
}
