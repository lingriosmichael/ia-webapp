import { createFileRoute } from "@tanstack/react-router";
import { ReportReadinessCheckPage } from "@/components/project/reportReadinessCheckPage";

export const Route = createFileRoute("/projects/$projectId/insights")({
  component: ReportReadinessCheckPage,
});
