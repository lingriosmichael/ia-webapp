import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/hooks/use-auth';
import {
  rememberActiveOrganizationId,
  resolveActiveOrganizationId,
} from '@/lib/organization-selection';
import { resolveWorkspaceDestination } from '@/lib/workspace-routing';
import { ApiError } from '@/services/api-client';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await registerMutation.mutateAsync({
        fullName,
        organizationName,
        email,
        password,
      });

      const organizationId = resolveActiveOrganizationId(
        response.organizations,
        response.organizations[0]?.id,
      );
      if (!organizationId) {
        toast.error(t('auth.registerNoOrganizationToast'));
        return;
      }

      rememberActiveOrganizationId(organizationId);
      toast.success(t('auth.registerSuccessToast'));
      const destination = await resolveWorkspaceDestination(organizationId);
      void navigate(destination);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : t('auth.registerFailed');
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.14),_transparent_34%),linear-gradient(180deg,_#fbf8f1_0%,_#f4efe5_100%)] text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <section className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-primary">{t('common.brand')}</Link>
              <LanguageSwitcher />
            </div>
            <div className="mt-12 max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{t('auth.foundation')}</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">{t('auth.registerMarketingTitle')}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{t('auth.registerMarketingDescription')}</p>
            </div>
          </div>
        </section>
        <section className="flex items-center">
          <div className="w-full rounded-[28px] border border-border/80 bg-card/92 p-8 shadow-[var(--shadow-elevated)] backdrop-blur">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">{t('auth.registerTitle')}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('auth.registerDescription')}</p>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('auth.fullName')}</label>
                <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={t('auth.fullNamePlaceholder')} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('auth.organizationName')}</label>
                <Input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder={t('auth.organizationPlaceholder')} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('auth.email')}</label>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('auth.emailPlaceholder')} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t('auth.passwordPlaceholder')} required />
              </div>
              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? t('auth.creatingAccount') : t('auth.createAccount')}
              </Button>
            </form>
            <div className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">{t('common.logIn')}</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
