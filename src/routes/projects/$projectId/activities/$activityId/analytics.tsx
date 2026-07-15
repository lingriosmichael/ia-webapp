import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LegacyRedirect } from "@/components/legacyRedirect";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/analytics",
)({
  component: LegacyAnalyticsRedirect,
});

function LegacyAnalyticsRedirect() {
  const { projectId, activityId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <LegacyRedirect
      onRedirect={() => {
        void navigate({
          to: "/projects/$projectId/activities/$activityId/analysis",
          params: { projectId, activityId },
          replace: true,
        });
      }}
    />
  );
}
