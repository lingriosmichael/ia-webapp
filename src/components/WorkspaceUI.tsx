import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronRight, Search, Command } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/languageSwitcher';

interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function TopBar({
  crumbs,
  actions,
}: {
  crumbs: Crumb[];
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useTranslation();

  return (
    <header
      key={pathname}
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border/70 bg-background/80 px-6 backdrop-blur"
    >
      <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
            {c.to ? (
              <Link
                to={c.to}
                params={c.params}
                className="rounded px-1.5 py-0.5 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {c.label}
              </Link>
            ) : (
              <span className="px-1.5 py-0.5 font-medium text-foreground">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          className="hidden h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-secondary md:inline-flex"
          aria-label={t('common.searchAria')}
        >
          <Search className="h-3.5 w-3.5" />
          <span>{t('common.search')}</span>
          <span className="ml-2 inline-flex items-center gap-0.5 rounded border border-border bg-secondary px-1 py-0.5 text-[10px]">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </button>
        <LanguageSwitcher />
        {actions}
      </div>
    </header>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  accent = false,
}: {
  label: string;
  value: string;
  delta?: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="text-[12px] font-medium text-muted-foreground">{label}</div>
      <div
        className={`mt-2 text-[26px] font-semibold tracking-tight ${accent ? 'text-primary' : 'text-foreground'}`}
      >
        {value}
      </div>
      {delta && <div className="mt-1 text-[12px] text-muted-foreground">{delta}</div>}
    </Card>
  );
}

export function PrivacyBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}
