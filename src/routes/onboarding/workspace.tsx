import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PublicMarketingShell } from "@/components/publicMarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/hooks/useAuth";
import { useCreateOrganizationMutation } from "@/hooks/useGrantready";
import {
  rememberActiveOrganizationId,
  resolveActiveOrganizationId,
} from "@/lib/organizationSelection";
import { resolveWorkspaceDestination } from "@/lib/workspaceRouting";
import { ApiError } from "@/services/apiClient";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/workspace")({
  component: OnboardingWorkspacePage,
});

function OnboardingWorkspacePage() {
  const navigate = useNavigate();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const createOrganizationMutation = useCreateOrganizationMutation();
  const [organizationName, setOrganizationName] = useState("");

  useEffect(() => {
    const organizationId = resolveActiveOrganizationId(
      auth.data?.organizations ?? [],
    );
    if (organizationId) {
      void resolveWorkspaceDestination(organizationId).then((destination) =>
        navigate(destination),
      );
    }
  }, [auth.data?.organizations, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const organization = await createOrganizationMutation.mutateAsync({
        name: organizationName,
      });
      rememberActiveOrganizationId(organization.id);
      toast.success(t("auth.workspaceCreatedToast"));
      void navigate({ to: "/onboarding/welcome" });
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("auth.workspaceCreateFailed"),
      );
    }
  }

  return (
    <PublicMarketingShell
      currentPage="register"
      title={t("auth.workspaceProvisioningTitle")}
      description={t("auth.workspaceProvisioningDescription")}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("auth.workspaceProvisioningCardTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t("auth.workspaceProvisioningCardDescription")}
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.organizationName")}
          </label>
          <Input
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            placeholder={t("auth.organizationPlaceholder")}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={createOrganizationMutation.isPending}
        >
          {createOrganizationMutation.isPending
            ? t("auth.creatingWorkspace")
            : t("landing.createWorkspace")}
        </Button>
      </form>
    </PublicMarketingShell>
  );
}
