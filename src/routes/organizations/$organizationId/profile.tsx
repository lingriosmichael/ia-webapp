import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/organizations/$organizationId/profile")({
  component: OrganizationProfilePage,
});

function OrganizationProfilePage() {
  return (
    <Navigate
      to="/organizations/$organizationId/settings"
      params={Route.useParams()}
    />
  );
}
