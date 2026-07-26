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
    <div className="min-h-screen bg-[linear-gradient(180deg,_#e3ece0_0%,_#e3ece0_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-4 md:pb-8 md:pt-5">
        <PublicSiteHeader currentPage="landing" />

        <div className="mx-auto max-w-2xl py-12 md:py-14">
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
