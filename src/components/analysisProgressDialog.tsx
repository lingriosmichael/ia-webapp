import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ProcessingJobRecord } from "@/services/apiClient";

export function AnalysisProgressDialog({
  open,
  onOpenChange,
  job,
  onReviewPrivacy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: ProcessingJobRecord | undefined;
  onReviewPrivacy: () => void;
}) {
  const { t } = useTranslation();

  function handleReviewPrivacy() {
    onOpenChange(false);
    onReviewPrivacy();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          {job?.status === "failed" ? (
            <>
              <AlertTriangle className="h-10 w-10 text-destructive" />
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("projectWorkspace.evidence.analysisDialogFailedTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {job.errorMessage ??
                    t("projectWorkspace.evidence.analysisDialogFailedFallback")}
                </p>
              </div>
            </>
          ) : job?.status === "awaiting_privacy_review" ? (
            <>
              <ShieldCheck className="h-10 w-10 text-primary" />
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("projectWorkspace.evidence.analysisDialogReadyTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(
                    "projectWorkspace.evidence.analysisDialogReadyDescription",
                  )}
                </p>
              </div>
              <Button onClick={handleReviewPrivacy}>
                {t("projectWorkspace.evidence.reviewPrivacy")}
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("projectWorkspace.evidence.analysisDialogAnalyzingTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(
                    "projectWorkspace.evidence.analysisDialogAnalyzingDescription",
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
