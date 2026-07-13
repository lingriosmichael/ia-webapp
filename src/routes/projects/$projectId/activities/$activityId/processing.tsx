import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/processing",
)({
  validateSearch: z.object({
    jobId: z.string().optional(),
  }),
  component: LegacyProcessingRedirect,
});

function LegacyProcessingRedirect() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    void navigate({
      to: "/projects/$projectId/activities",
      params: { projectId },
      replace: true,
    });
  }, [navigate, projectId]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      {t("activityBrief.redirectingToOverview")}
    </div>
  );
}
