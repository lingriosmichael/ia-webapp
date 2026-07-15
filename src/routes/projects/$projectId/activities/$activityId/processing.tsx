import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LegacyRedirect } from "@/components/legacyRedirect";

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
