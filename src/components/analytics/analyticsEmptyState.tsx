import type { ReactNode } from "react";

export function AnalyticsErrorState({ label }: { label: ReactNode }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
