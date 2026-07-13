import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Search, Command } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function TopBar({
  crumbs,
  actions,
  leading,
}: {
  crumbs: Crumb[];
  actions?: ReactNode;
  leading?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useTranslation();

  return (
    <header
      key={pathname}
      className="sticky top-0 z-20 border-b border-border/70 bg-background/88 backdrop-blur"
    >
      <PageContainer className="flex h-[3.75rem] items-center justify-between gap-4 py-0">
        <div className="flex min-w-0 items-center gap-2">
          {leading}
          <nav className="flex min-w-0 items-center gap-1.5 overflow-x-auto text-[13px] text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={i} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                {c.to ? (
                  <Link
                    to={c.to}
                    params={c.params}
                    className="truncate rounded-md px-1.5 py-0.5 transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="truncate px-1.5 py-0.5 font-medium text-foreground">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className="hidden h-8 items-center gap-2 rounded-[10px] border border-border bg-card px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-secondary md:inline-flex"
            aria-label={t("common.searchAria")}
          >
            <Search className="h-3.5 w-3.5" />
            <span>{t("common.search")}</span>
            <span className="ml-2 inline-flex items-center gap-0.5 rounded-md border border-border bg-secondary px-1 py-0.5 text-[10px]">
              <Command className="h-2.5 w-2.5" />K
            </span>
          </button>
          <LanguageSwitcher />
          {actions}
        </div>
      </PageContainer>
    </header>
  );
}

export function PageHeader({
  eyebrow,
  title,
  metadata,
  description,
  actions,
  contentClassName,
}: {
  eyebrow?: string;
  title: string;
  metadata?: ReactNode;
  description?: string;
  actions?: ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className={cn("max-w-[45rem]", contentClassName)}>
        {eyebrow && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[2rem] leading-[1.15] font-semibold tracking-tight text-foreground sm:text-[2.25rem]">
          {title}
        </h1>
        {metadata ? (
          <div className="mt-2.5 text-sm text-muted-foreground">{metadata}</div>
        ) : null}
        {description && (
          <p className="mt-3 max-w-[43rem] text-[14px] leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8 xl:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[14px] border border-border/85 bg-card ${className}`}
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
      <div className="text-[12px] font-medium text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-2 text-[28px] font-semibold tracking-tight ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </div>
      {delta && (
        <div className="mt-1.5 text-[12px] text-muted-foreground">{delta}</div>
      )}
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
