import type { ReactNode } from "react";
import { PublicSiteHeader } from "@/components/PublicSiteHeader";
import { cn } from "@/lib/utils";

export function PublicMarketingShell({
  currentPage,
  title,
  description,
  sidebar,
  children,
  panelAlignment = "top",
  copyClassName,
}: {
  currentPage: "landing" | "login" | "register";
  title: string;
  description: string;
  sidebar?: ReactNode;
  children: ReactNode;
  panelAlignment?: "center" | "top";
  copyClassName?: string;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#e3ece0_0%,_#e3ece0_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-4 pt-4 md:pb-6 md:pt-5">
        <PublicSiteHeader currentPage={currentPage} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-4 md:pt-6 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between">
          <div
            className={cn("max-w-3xl pt-16 md:pt-20 lg:pt-24", copyClassName)}
          >
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
            {sidebar ? <div className="mt-8">{sidebar}</div> : null}
          </div>
        </section>
        <section
          className={cn(
            "flex",
            panelAlignment === "top"
              ? "items-start pt-2 md:pt-4"
              : "items-center",
          )}
        >
          <div className="w-full rounded-[28px] border border-border/80 bg-card/92 p-8 shadow-[var(--shadow-elevated)] backdrop-blur">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
