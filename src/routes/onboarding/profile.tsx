import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicMarketingShell } from "@/components/publicMarketingShell";
import { OrganizationSettingsPanel } from "@/components/organizationSettingsPanel";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useAuth";
import { useOrganizationWorkspaceQuery } from "@/hooks/useWorkspaceQueries";
import { resolveActiveOrganizationId } from "@/lib/organizationSelection";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/profile")({
  component: OnboardingProfilePage,
});

function OnboardingProfilePage() {
  const navigate = useNavigate();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const organizationId = resolveActiveOrganizationId(
    auth.data?.organizations ?? [],
  );
  const workspaceQuery = useOrganizationWorkspaceQuery(
    organizationId ?? "",
    Boolean(auth.token && organizationId),
  );

  if (!organizationId || workspaceQuery.isLoading || !workspaceQuery.data) {
    return null;
  }

  return (
    <PublicMarketingShell
      currentPage="register"
      title={t("auth.profileTitle")}
      description={t("auth.profileDescription")}
    >
      <div className="space-y-6">
        <OrganizationSettingsPanel
          organization={workspaceQuery.data.organization}
        />
        <Button
          className="w-full"
          onClick={() => void navigate({ to: "/onboarding/invite" })}
        >
          {t("common.continue")}
        </Button>
      </div>
    </PublicMarketingShell>
  );
}
