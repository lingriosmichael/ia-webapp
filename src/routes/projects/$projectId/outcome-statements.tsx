import { createFileRoute } from "@tanstack/react-router";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { OutcomeEvidencePairingReviewPanel } from "@/components/outcomeEvidencePairingReviewPanel";
import { useProjectWorkspacePage } from "@/contexts/projectWorkspaceContext";
import { useWorkspaceLocale } from "@/hooks/useWorkspaceLocale";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useProjectOutcomeStatementsQuery,
  useRunOutcomeEvidencePairingMutation,
} from "@/hooks/useWorkspaceQueries";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/outcome-statements")(
  {
    component: ProjectOutcomeStatementsPage,
  },
);

function ProjectOutcomeStatementsPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const locale = useWorkspaceLocale();
  const { project } = useProjectWorkspacePage();
  const outcomeStatementsQuery = useProjectOutcomeStatementsQuery(
    projectId,
    Boolean(auth.token),
  );
  const runPairingMutation = useRunOutcomeEvidencePairingMutation(projectId);

  const canEdit = project.permissions.canEdit;

  if (!auth.token || outcomeStatementsQuery.isLoading) {
    return (
      <ProjectWorkspaceShell>
        <CenteredState label={locale.outcomeStatements.loading} />
      </ProjectWorkspaceShell>
    );
  }

  const outcomeStatements = outcomeStatementsQuery.data ?? [];

  async function handleRunEvidencePairing() {
    try {
      await runPairingMutation.mutateAsync();
      toast.success(locale.outcomeEvidencePairing.runSuccess);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : locale.outcomeEvidencePairing.runFailure,
      );
    }
  }

  return (
    <ProjectWorkspaceShell
      actions={
        canEdit ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleRunEvidencePairing}
              disabled={runPairingMutation.isPending}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {runPairingMutation.isPending
                ? locale.outcomeEvidencePairing.runningAction
                : locale.outcomeEvidencePairing.runAction}
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="mt-6">
        <OutcomeEvidencePairingReviewPanel
          projectId={projectId}
          outcomeStatements={outcomeStatements}
        />
      </div>
    </ProjectWorkspaceShell>
  );
}

function CenteredState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
