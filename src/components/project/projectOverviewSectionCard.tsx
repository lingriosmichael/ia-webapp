import type { ReactNode } from "react";
import { Card } from "@/components/workspaceUI";
import { cn } from "@/lib/utils";

export function ProjectOverviewSectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-6 sm:p-7", className)}>
      <div className="text-[15px] font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
