import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PublicMarketingShell } from "@/components/publicMarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useCreateInvitationMutation,
  useOrganizationInvitationsQuery,
} from "@/hooks/useWorkspaceQueries";
import { resolveActiveOrganizationId } from "@/lib/organizationSelection";
import { resolveWorkspaceDestination } from "@/lib/workspaceRouting";
import { ApiError } from "@/services/apiClient";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/onboarding/invite")({
  component: OnboardingInvitePage,
});

function OnboardingInvitePage() {
  const navigate = useNavigate();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const organizationId = resolveActiveOrganizationId(
    auth.data?.organizations ?? [],
  );
  const [email, setEmail] = useState("");
  const createInvitationMutation = useCreateInvitationMutation(
    organizationId ?? "",
  );
  const invitationsQuery = useOrganizationInvitationsQuery(
    organizationId ?? "",
    Boolean(auth.token && organizationId),
  );

  if (!organizationId) {
    return null;
  }

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createInvitationMutation.mutateAsync({
        email,
        role: "PROJECT_MANAGER",
      });
      setEmail("");
      toast.success(t("auth.inviteSuccessToast"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : t("auth.inviteFailedToast"),
      );
    }
  }

  return (
    <PublicMarketingShell
      currentPage="register"
      title={t("auth.inviteTitle")}
      description={t("auth.inviteDescription")}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("auth.inviteCardTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("auth.inviteCardDescription")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={invite}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              required
            />
          </div>
          <div className="rounded-md border border-border bg-secondary/20 px-3 py-2 text-sm text-muted-foreground">
            {t("auth.projectManagerOnly")}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createInvitationMutation.isPending}
          >
            {createInvitationMutation.isPending
              ? t("auth.inviting")
              : t("auth.sendInvitation")}
          </Button>
        </form>

        {(invitationsQuery.data ?? []).filter(
          (invitation) => invitation.status === "pending",
        ).length > 0 ? (
          <div className="space-y-3">
            {(invitationsQuery.data ?? [])
              .filter((invitation) => invitation.status === "pending")
              .map((invitation) => (
                <div
                  key={invitation.id}
                  className="rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm"
                >
                  <div className="font-medium text-foreground">
                    {invitation.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("auth.pendingInvitation")}
                  </div>
                </div>
              ))}
          </div>
        ) : null}

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            void resolveWorkspaceDestination(organizationId).then(
              (destination) => navigate(destination),
            )
          }
        >
          {t("auth.finishOnboarding")}
        </Button>
      </div>
    </PublicMarketingShell>
  );
}
