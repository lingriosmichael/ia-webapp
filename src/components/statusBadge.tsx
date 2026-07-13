import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function resolveStatusTone(status: string | null | undefined) {
  switch (status) {
    case "planning":
    case "draft":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "active":
    case "queued":
    case "processing":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "pending":
    case "awaiting_privacy_review":
    case "transforming":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "completed":
    case "available":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "uploaded":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "failed":
    case "cancelled":
    case "missing":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-border bg-secondary text-secondary-foreground";
  }
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string | null | undefined;
  label: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 border px-2.5 py-0 text-[11px] font-semibold shadow-none",
        resolveStatusTone(status),
        className,
      )}
    >
      {label}
    </Badge>
  );
}
