import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LegacyRedirect } from "@/components/legacyRedirect";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/analysis",
)({
  component: LegacyActivityAnalysisRedirect,
});

function LegacyActivityAnalysisRedirect() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <LegacyRedirect
      onRedirect={() => {
        void navigate({
          to: "/projects/$projectId/analytics",
          params: { projectId },
          replace: true,
        });
      }}
    />
  );
}
