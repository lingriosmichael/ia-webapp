import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/languageSwitcher';
import { cn } from '@/lib/utils';

type PublicPage = 'landing' | 'login' | 'register';

export function PublicSiteHeader({ currentPage }: { currentPage: PublicPage }) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-4">
      <Link to="/" className="text-sm font-semibold tracking-[0.18em] text-primary">
        {t('common.brand')}
      </Link>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          to="/login"
          className={cn(
            'inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors',
            currentPage === 'login'
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent hover:text-accent-foreground',
          )}
          aria-current={currentPage === 'login' ? 'page' : undefined}
        >
          {t('common.logIn')}
        </Link>
        <Link
          to="/register"
          className={cn(
            'inline-flex h-9 items-center rounded-md px-4 text-sm font-medium shadow transition-colors',
            currentPage === 'register'
              ? 'bg-primary text-primary-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
          aria-current={currentPage === 'register' ? 'page' : undefined}
        >
          {t('common.register')}
        </Link>
      </div>
    </header>
  );
}
