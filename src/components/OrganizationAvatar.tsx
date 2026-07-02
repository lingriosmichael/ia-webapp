import { resolveApiUrl } from '@/services/apiClient';
import { cn } from '@/lib/utils';

export function OrganizationAvatar({
  name,
  initials,
  logoUrl,
  className,
}: {
  name: string;
  initials: string;
  logoUrl: string | null;
  className?: string;
}) {
  const resolvedLogoUrl = resolveApiUrl(logoUrl);

  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sidebar-border bg-[linear-gradient(135deg,oklch(0.97_0.02_300),oklch(0.93_0.02_260))] text-sm font-semibold tracking-[0.08em] text-primary shadow-[var(--shadow-soft)]',
        className,
      )}
      aria-hidden="true"
    >
      {resolvedLogoUrl ? (
        <img
          src={resolvedLogoUrl}
          alt={`${name} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
