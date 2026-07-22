import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PublicMarketingShell } from "@/components/PublicMarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAcceptInvitationMutation,
  useInvitationQuery,
} from "@/hooks/useWorkspaceQueries";
import { sessionQueryKey, useSessionQuery } from "@/hooks/useAuth";
import { rememberActiveOrganizationId } from "@/lib/organizationSelection";
import { resolveWorkspaceDestination } from "@/lib/workspaceRouting";
import { apiClient, ApiError } from "@/services/apiClient";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/invitations/$token/accept")({
  component: InvitationAcceptancePage,
});

function InvitationAcceptancePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const invitationQuery = useInvitationQuery(token, Boolean(token));
  const sessionQuery = useSessionQuery();
  const acceptMutation = useAcceptInvitationMutation(token);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const invitation = invitationQuery.data;
  const acceptanceMode = invitation?.acceptanceMode;
  const invitedEmail = invitation?.email.toLowerCase() ?? null;
  const signedInEmail = sessionQuery.data?.user.email.toLowerCase() ?? null;
  const requiresExistingAccountSignIn = acceptanceMode === "sign_in";
  const isSignedInAsInvitedUser =
    requiresExistingAccountSignIn &&
    Boolean(invitedEmail) &&
    signedInEmail === invitedEmail;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const accepted = await acceptMutation.mutateAsync(
        requiresExistingAccountSignIn ? {} : { fullName, password },
      );

      if (accepted.acceptanceMode === "sign_in") {
        await queryClient.fetchQuery({
          queryKey: sessionQueryKey,
          queryFn: () => apiClient.getSession(),
        });

        rememberActiveOrganizationId(accepted.invitation.organizationId);
        toast.success(t("auth.invitationAcceptedExistingAccount"));
        const destination = await resolveWorkspaceDestination(
          accepted.invitation.organizationId,
        );
        void navigate(destination);
        return;
      }

      toast.success(t("auth.invitationAccepted"));
      void navigate({ to: "/login" });
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("auth.invitationAcceptFailed"),
      );
    }
  }

  const invitationDescription = invitation
    ? requiresExistingAccountSignIn
      ? signedInEmail && !isSignedInAsInvitedUser
        ? t("auth.invitationExistingAccountMismatch", {
            invitedEmail: invitation.email,
            signedInEmail: sessionQuery.data?.user.email ?? "",
          })
        : t("auth.invitationExistingAccountDescription", {
            organization: invitation.organizationName,
            email: invitation.email,
          })
      : t("auth.invitationCardDescription", {
          organization: invitation.organizationName,
          email: invitation.email,
        })
    : t("common.loading");

  return (
    <PublicMarketingShell
      currentPage="login"
      title={t("auth.invitationTitle")}
      description={t("auth.invitationDescription")}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("auth.invitationCardTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {invitationDescription}
        </p>
      </div>

      {requiresExistingAccountSignIn ? (
        isSignedInAsInvitedUser ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <Button
              type="submit"
              className="w-full"
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending
                ? t("auth.acceptingInvitation")
                : t("auth.acceptInvitation")}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link
                to="/login"
                search={{
                  invitationToken: token,
                }}
              >
                {t("auth.signInToAcceptInvitation")}
              </Link>
            </Button>
          </div>
        )
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.fullName")}
            </label>
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder={t("auth.fullNamePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.password")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending
              ? t("auth.acceptingInvitation")
              : t("auth.acceptInvitation")}
          </Button>
        </form>
      )}

      <div className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
        <Link
          to="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("common.logIn")}
        </Link>
      </div>
    </PublicMarketingShell>
  );
}
