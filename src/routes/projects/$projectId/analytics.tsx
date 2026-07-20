import { createFileRoute } from "@tanstack/react-router";
import { ProjectAnalyticsPage } from "@/components/project/projectAnalyticsPage";

export const Route = createFileRoute("/projects/$projectId/analytics")({
  component: ProjectAnalyticsPage,
});
