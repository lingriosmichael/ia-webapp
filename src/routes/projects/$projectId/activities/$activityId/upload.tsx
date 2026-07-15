import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LegacyRedirect } from "@/components/legacyRedirect";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/upload",
)({
  component: LegacyUploadRedirect,
});

function LegacyUploadRedirect() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <LegacyRedirect
      onRedirect={() => {
        void navigate({
          to: "/projects/$projectId/activities",
          params: { projectId },
          replace: true,
        });
      }}
    />
  );
}
