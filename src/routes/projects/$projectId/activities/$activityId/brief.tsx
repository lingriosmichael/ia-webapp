import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/brief",
)({
  component: LegacyBriefRedirect,
});

function LegacyBriefRedirect() {
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
