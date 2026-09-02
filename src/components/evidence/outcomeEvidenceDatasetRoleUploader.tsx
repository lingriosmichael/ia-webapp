import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_EVIDENCE_FILE_ACCEPT } from "@/lib/evidenceFileTypes";
import type { UploadDatasetRole } from "@/services/apiClient";

const DATASET_ROLES: readonly UploadDatasetRole[] = ["baseline", "followup"];

export interface OutcomeEvidenceDatasetRoleSelection {
  role: UploadDatasetRole;
  file: File;
}

// The classification step this component implements only replaces *how*
// files reach the fixed "outcome_evidence" activity's upload button — one
// slot per role instead of a plain multi-file picker — so a human always
// sets which file is baseline vs follow-up. It does not decide anything
// about the files itself; onConfirm hands the (role, file) pairs back to
// the caller, which still runs them through the exact same upload mutation
// every other activity uses. See OUTCOME_EVIDENCE_MERGE_PLAN.md.
export function OutcomeEvidenceDatasetRoleUploader({
  onConfirm,
  onCancel,
}: {
  onConfirm: (
    selections: OutcomeEvidenceDatasetRoleSelection[],
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [pendingByRole, setPendingByRole] = useState<
    Record<UploadDatasetRole, File | null>
  >({ baseline: null, followup: null });
  const [isConfirming, setIsConfirming] = useState(false);
  const baselineInputRef = useRef<HTMLInputElement>(null);
  const followupInputRef = useRef<HTMLInputElement>(null);
  const inputRefByRole = {
    baseline: baselineInputRef,
    followup: followupInputRef,
  } as const;
  const roleLabel: Record<UploadDatasetRole, string> = {
    baseline: t("projectWorkspace.evidence.datasetRoleSlotBaseline"),
    followup: t("projectWorkspace.evidence.datasetRoleSlotFollowup"),
  };
  const hasAnySelection = DATASET_ROLES.some(
    (role) => pendingByRole[role] !== null,
  );

  function handlePick(
    role: UploadDatasetRole,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (file) {
      setPendingByRole((current) => ({ ...current, [role]: file }));
    }
  }

  function clearSlot(role: UploadDatasetRole) {
    setPendingByRole((current) => ({ ...current, [role]: null }));
  }

  async function handleConfirm() {
    const selections = DATASET_ROLES.filter(
      (role) => pendingByRole[role] !== null,
    ).map((role) => ({ role, file: pendingByRole[role] as File }));

    if (selections.length === 0) {
      return;
    }

    setIsConfirming(true);
    try {
      await onConfirm(selections);
      setPendingByRole({ baseline: null, followup: null });
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <div className="border-t border-border/70 bg-muted/30 px-5 py-4">
      <p className="text-xs text-muted-foreground">
        {t("projectWorkspace.evidence.datasetRoleSlotHint")}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {DATASET_ROLES.map((role) => {
          const file = pendingByRole[role];
          const inputRef = inputRefByRole[role];

          return (
            <div key={role} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                {roleLabel[role]}
              </span>
              <input
                ref={inputRef}
                type="file"
                accept={SUPPORTED_EVIDENCE_FILE_ACCEPT}
                className="hidden"
                onChange={(event) => handlePick(role, event)}
              />
              {file ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => clearSlot(role)}
                    aria-label={t("projectWorkspace.evidence.removeFile")}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <UploadCloud className="h-4 w-4 shrink-0" />
                  {t("projectWorkspace.evidence.datasetRoleDropzoneHint")}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isConfirming}
        >
          {t("projectWorkspace.evidence.datasetRoleCancel")}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleConfirm}
          disabled={!hasAnySelection || isConfirming}
        >
          {t("projectWorkspace.evidence.datasetRoleConfirm")}
        </Button>
      </div>
    </div>
  );
}
