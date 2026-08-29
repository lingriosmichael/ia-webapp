import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/WorkspaceUI";

export function ImpactStoryEmptyState({
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

export function ImpactStoryErrorState({ label }: { label: ReactNode }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

// Replaces the whole dashboard — stale charts and all — while a run is in
// flight, instead of leaving old content on screen next to a button that's
// merely disabled. A run can take upwards of ten minutes of real LLM
// latency, and the previous state (button disabled, everything else
// unchanged) gave no visible sign anything was happening for most of that
// time. ProjectImpactStoryPage swaps this in for as long as isRegenerating
// is true, regardless of whether a story already exists to show.
export function ImpactStoryRegeneratingState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
      <Loader2
        className="h-8 w-8 animate-spin text-primary"
        aria-hidden="true"
      />
      <div className="max-w-md space-y-1.5">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
