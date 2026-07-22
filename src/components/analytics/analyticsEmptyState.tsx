import type { ReactNode } from "react";
import { Card } from "@/components/WorkspaceUI";

export const analyticsCtaLinkClassName =
  "mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90";

export function AnalyticsEmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: ReactNode;
}) {
  return (
    <Card className="mt-6 border-primary/15 bg-primary-soft/25 p-8">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        {cta}
      </div>
    </Card>
  );
}

export function AnalyticsErrorState({ label }: { label: ReactNode }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
