import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { UploadDatasetRole } from "@/services/apiClient";

// Renders and lets a human flip a file's baseline/follow-up classification
// in place — a one-click correction, not a re-upload. See
// OUTCOME_EVIDENCE_MERGE_PLAN.md's pre/post inversion fix.
export function OutcomeEvidenceDatasetRoleTag({
  role,
  onToggle,
  disabled,
}: {
  role: UploadDatasetRole;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const label =
    role === "baseline"
      ? t("projectWorkspace.evidence.datasetRoleSlotBaseline")
      : t("projectWorkspace.evidence.datasetRoleSlotFollowup");

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={t("projectWorkspace.evidence.datasetRoleToggleAria")}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-60"
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          role === "baseline" ? "bg-primary" : "bg-muted-foreground",
        )}
      />
      {label}
    </button>
  );
}
