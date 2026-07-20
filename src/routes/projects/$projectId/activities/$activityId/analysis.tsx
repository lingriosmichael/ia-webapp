import { createFileRoute } from "@tanstack/react-router";
import { ActivityAnalyticsPage } from "@/components/project/activityAnalyticsPage";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/analysis",
)({
  component: ActivityAnalyticsPage,
});
