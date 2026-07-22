import type { ReactNode } from "react";
import { PublicSiteHeader } from "@/components/PublicSiteHeader";

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.14),_transparent_34%),linear-gradient(180deg,_#fbf8f1_0%,_#f4efe5_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PublicSiteHeader currentPage="landing" />

        <div className="mx-auto max-w-2xl py-16">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <div className="mt-6 text-sm leading-7 text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
