import type { ReactNode } from "react";
import { PublicSiteHeader } from "@/components/PublicSiteHeader";

export function PublicMarketingShell({
  currentPage,
  title,
  description,
  sidebar,
  children,
}: {
  currentPage: "landing" | "login" | "register";
  title: string;
  description: string;
  sidebar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.14),_transparent_34%),linear-gradient(180deg,_#fbf8f1_0%,_#f4efe5_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PublicSiteHeader currentPage={currentPage} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-8 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
            {sidebar ? <div className="mt-8">{sidebar}</div> : null}
          </div>
        </section>
        <section className="flex items-center">
          <div className="w-full rounded-[28px] border border-border/80 bg-card/92 p-8 shadow-[var(--shadow-elevated)] backdrop-blur">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
