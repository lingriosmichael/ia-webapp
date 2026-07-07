import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/settings")({
  component: ProjectSettingsPage,
});

function ProjectSettingsPage() {
  const { projectId } = Route.useParams();

  return <Navigate to="/projects/$projectId" params={{ projectId }} replace />;
}
