import { createFileRoute } from "@tanstack/react-router";
import { ProjectImpactStoryPage } from "@/components/impactStory/projectImpactStoryPage";

export const Route = createFileRoute("/projects/$projectId/analytics")({
  component: ProjectImpactStoryPage,
});
