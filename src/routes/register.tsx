import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PublicMarketingShell } from "@/components/publicMarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/hooks/useAuth";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await registerMutation.mutateAsync({
        fullName,
        email,
        password,
      });
      toast.success(t("auth.registerSuccessToast"));
      void navigate({ to: "/onboarding/workspace" });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t("auth.registerFailed");
      toast.error(message);
    }
  }

  return (
    <PublicMarketingShell
      currentPage="register"
      title={t("auth.registerMarketingTitle")}
      description={t("auth.registerMarketingDescription")}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("auth.registerTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t("auth.registerDescription")}
        </p>
      </div>
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? t("auth.creatingAccount")
            : t("auth.createAccount")}
        </Button>
      </form>
      <div className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
        {t("auth.alreadyHaveAccount")}{" "}
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
