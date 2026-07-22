import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { PublicMarketingShell } from "@/components/PublicMarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/useAuth";
import {
  rememberActiveOrganizationId,
  resolveActiveOrganizationId,
} from "@/lib/organizationSelection";
import { resolveWorkspaceDestination } from "@/lib/workspaceRouting";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    invitationToken: z.string().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({ email, password });
      if (search.invitationToken) {
        toast.success(t("auth.loginSuccessToast"));
        void navigate({
          to: "/invitations/$token/accept",
          params: { token: search.invitationToken },
        });
        return;
      }

      const organizationId = resolveActiveOrganizationId(
        response.organizations,
        response.organizations[0]?.id,
      );
      if (!organizationId) {
        toast.success(t("auth.loginSuccessToast"));
        void navigate({ to: "/onboarding/workspace" });
        return;
      }

      rememberActiveOrganizationId(organizationId);
      toast.success(t("auth.loginSuccessToast"));
      const destination = await resolveWorkspaceDestination(organizationId);
      void navigate(destination);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t("auth.loginFailed");
      toast.error(message);
    }
  }

  return (
    <AuthShell
      title={t("auth.loginTitle")}
      description={t("auth.loginDescription")}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.email")}
          </label>
          <Input
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.password")}
          </label>
          <Input
            type="password"
            placeholder={t("auth.hiddenPasswordPlaceholder")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? t("auth.loggingIn") : t("common.logIn")}
        </Button>
      </form>
      <div className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
        {t("auth.newHere")}{" "}
        <Link
          to="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("auth.createAnAccount")}
        </Link>
      </div>
    </AuthShell>
  );
}

function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <PublicMarketingShell
      currentPage="login"
      title={t("auth.loginMarketingTitle")}
      description={t("auth.loginMarketingDescription")}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </PublicMarketingShell>
  );
}
