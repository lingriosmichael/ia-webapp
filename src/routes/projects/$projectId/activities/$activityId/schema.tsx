import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LegacyRedirect } from "@/components/legacyRedirect";

export const Route = createFileRoute(
  "/projects/$projectId/activities/$activityId/schema",
)({
  component: LegacySchemaRedirect,
});

function LegacySchemaRedirect() {
  const { projectId, activityId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <LegacyRedirect
      onRedirect={() => {
        void navigate({
          to: "/projects/$projectId/activities/$activityId/data-review",
          params: { projectId, activityId },
          replace: true,
        });
      }}
    />
  );
}
