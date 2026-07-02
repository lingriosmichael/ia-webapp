import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PublicMarketingShell } from "@/components/PublicMarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAcceptInvitationMutation, useInvitationQuery } from "@/hooks/use-grantready";
import { ApiError } from "@/services/api-client";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/invitations/$token/accept")({
  component: InvitationAcceptancePage,
});

function InvitationAcceptancePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invitationQuery = useInvitationQuery(token, Boolean(token));
  const acceptMutation = useAcceptInvitationMutation(token);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const accepted = await acceptMutation.mutateAsync({ fullName, password });
      toast.success(
        accepted.hasExistingAccount
          ? t("auth.invitationAcceptedExistingAccount")
          : t("auth.invitationAccepted"),
      );
      void navigate({ to: "/login" });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t("auth.invitationAcceptFailed"));
    }
  }

  return (
    <PublicMarketingShell
      currentPage="login"
      title={t("auth.invitationTitle")}
      description={t("auth.invitationDescription")}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{t("auth.invitationCardTitle")}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {invitationQuery.data
            ? t("auth.invitationCardDescription", {
                organization: invitationQuery.data.organizationName,
                email: invitationQuery.data.email,
              })
            : t("common.loading")}
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t("auth.fullName")}</label>
          <Input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t("auth.fullNamePlaceholder")}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t("auth.password")}</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={acceptMutation.isPending}>
          {acceptMutation.isPending ? t("auth.acceptingInvitation") : t("auth.acceptInvitation")}
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          {t("common.logIn")}
        </Link>
      </div>
    </PublicMarketingShell>
  );
}
