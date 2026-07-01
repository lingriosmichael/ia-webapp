import '../styles.css';
import '@/lib/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from '@/components/ui/sonner';
import { hydrateStoredLanguage, setDocumentLanguage } from '@/lib/i18n';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { i18n } = useTranslation();

  useEffect(() => {
    void hydrateStoredLanguage();
  }, []);

  useEffect(() => {
    setDocumentLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{t('common.notFoundTitle')}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{t('common.notFoundDescription')}</p>
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {t('common.backToHome')}
        </Link>
      </div>
    </div>
  );
}
