import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicMarketingShell } from "@/components/PublicMarketingShell";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/use-auth";
import { resolveActiveOrganizationId } from "@/lib/organization-selection";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/welcome")({
  component: OnboardingWelcomePage,
});

function OnboardingWelcomePage() {
  const navigate = useNavigate();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const organizationId = resolveActiveOrganizationId(auth.data?.organizations ?? []);

  return (
    <PublicMarketingShell
      currentPage="register"
      title={t("auth.welcomeTitle")}
      description={t("auth.welcomeDescription")}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("auth.welcomeCardTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("auth.welcomeCardDescription")}</p>
        </div>
        <Button
          className="w-full"
          onClick={() => void navigate({ to: "/onboarding/profile" })}
          disabled={!organizationId}
        >
          {t("common.continue")}
        </Button>
      </div>
    </PublicMarketingShell>
  );
}
