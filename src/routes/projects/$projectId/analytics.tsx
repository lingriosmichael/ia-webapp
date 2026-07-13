import { createFileRoute } from "@tanstack/react-router";
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
