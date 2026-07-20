import { createFileRoute } from "@tanstack/react-router";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { useRequireAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/projects/$projectId/insights")({
  component: ProjectInsightsPage,
});

function ProjectInsightsPage() {
  useRequireAuth();

  return <ProjectWorkspaceShell>{null}</ProjectWorkspaceShell>;
}
