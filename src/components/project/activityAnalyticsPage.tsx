import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ActivityTabs } from "@/components/activityTabs";
import { PageHeader, PageContainer, TopBar } from "@/components/WorkspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  activityAnalysisV2LatestQueryKey,
  activityAnalysisV2RunsQueryKey,
  activityQueryKey,
  activityWorkflowStageQueryKey,
  useAcknowledgeInterpretationReviewMutation,
  useActivityAnalysisV2RunsQuery,
  useAnswerActivityAnalysisV2QuestionsMutation,
  useActivityQuery,
  useJobQuery,
  useLatestActivityAnalysisV2Query,
  useProjectQuery,
  useRunActivityAnalysisV2Mutation,
} from "@/hooks/useWorkspaceQueries";
import { AnalyticsErrorState } from "@/components/analytics/analyticsEmptyState";
import { ActivityAnalysisV2Panel } from "@/components/project/activityAnalysisV2Panel";
import {
  ApiError,
  type ActivityAnalysisRunV2Record,
} from "@/services/apiClient";

const TERMINAL_JOB_STATUSES = ["completed", "failed", "cancelled"];

export function ActivityAnalyticsPage() {
  const { projectId, activityId } = useParams({
    from: "/projects/$projectId/activities/$activityId/analysis",
  });
  const auth = useRequireAuth();
  const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
  const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
  const latestAnalysisV2Query = useLatestActivityAnalysisV2Query(
    activityId,
    Boolean(auth.token),
  );
  const analysisV2RunsQuery = useActivityAnalysisV2RunsQuery(
    activityId,
    Boolean(auth.token),
  );
  const runAnalysisV2Mutation = useRunActivityAnalysisV2Mutation(activityId);
  const answerQuestionsMutation =
    useAnswerActivityAnalysisV2QuestionsMutation(activityId);
  const acknowledgeMutation = useAcknowledgeInterpretationReviewMutation(
    activityId,
    projectQuery.data?.organizationId,
  );
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();
  const queryClient = useQueryClient();

  // Both runAnalysisV2Mutation and answerQuestionsMutation now create an
  // activity_analysis_v2 job rather than returning the finished run — this
  // tracks whichever one is currently in flight so a single effect below
  // can poll it and react once it reaches a terminal status.
  const [activeAnalysisJob, setActiveAnalysisJob] = useState<
    | { jobId: string; kind: "run" }
    | { jobId: string; kind: "answer"; answerCount: number }
    | null
  >(null);
  const activeAnalysisJobQuery = useJobQuery(
    activeAnalysisJob?.jobId,
    Boolean(activeAnalysisJob),
  );

  useEffect(() => {
    const job = activeAnalysisJobQuery.data;
    if (
      !activeAnalysisJob ||
      !job ||
      !TERMINAL_JOB_STATUSES.includes(job.status)
    ) {
      return;
    }

    const finishedJob = activeAnalysisJob;
    setActiveAnalysisJob(null);

    void (async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: activityAnalysisV2LatestQueryKey(activityId),
        }),
        queryClient.invalidateQueries({
          queryKey: activityAnalysisV2RunsQueryKey(activityId),
        }),
        queryClient.invalidateQueries({
          queryKey: activityWorkflowStageQueryKey(activityId),
        }),
        queryClient.invalidateQueries({
          queryKey: activityQueryKey(activityId),
        }),
      ]);

      if (job.status !== "completed") {
        toast.error(job.errorMessage ?? t("activityAnalytics.v2.runFailed"));
        return;
      }

      // The job's own status only means "did the worker finish attempting
      // this" — the analysis run it produced can still be status: "failed"
      // (e.g. a planner failure), so the success/failure toast reads the
      // freshly-invalidated run's own status, not the job's.
      const run = queryClient.getQueryData<ActivityAnalysisRunV2Record | null>(
        activityAnalysisV2LatestQueryKey(activityId),
      );

      if (run?.status === "failed") {
        toast.error(t("activityAnalytics.v2.runFailed"));
        return;
      }

      if (finishedJob.kind === "run") {
        toast.success(t("activityAnalytics.v2.runSuccess"));
      } else {
        toast.success(
          finishedJob.answerCount > 1
            ? t("activityAnalytics.v2.clarificationAnsweredBatch", {
                count: finishedJob.answerCount,
              })
            : t("activityAnalytics.v2.clarificationAnswered"),
        );
      }
    })();
  }, [
    activeAnalysisJobQuery.data,
    activeAnalysisJob,
    activityId,
    queryClient,
    t,
  ]);

  useEffect(() => {
    if (
      !activityQuery.data ||
      activityQuery.data.interpretationAcknowledgedAt ||
      !latestAnalysisV2Query.data ||
      // Only a run that actually finished successfully represents a
      // reviewable analysis. A failed run or one still paused on
      // clarification questions must never be silently acknowledged.
      latestAnalysisV2Query.data.status !== "completed" ||
      acknowledgeMutation.isPending ||
      // Without this, a failed acknowledgment attempt flips isPending back
      // to false and this effect fires mutate() again on the next render,
      // retrying indefinitely with no user-visible indication.
      acknowledgeMutation.isError
    ) {
      return;
    }

    acknowledgeMutation.mutate();
  }, [acknowledgeMutation, activityQuery.data, latestAnalysisV2Query.data]);

  async function handleRunActivityAnalysisV2() {
    try {
      const job = await runAnalysisV2Mutation.mutateAsync();
      setActiveAnalysisJob({ jobId: job.id, kind: "run" });
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("activityAnalytics.v2.runFailed"),
      );
    }
  }

  async function handleAnswerQuestions(payload: {
    answers: Array<{ questionId: string; answeredValue: string }>;
  }) {
    try {
      const job = await answerQuestionsMutation.mutateAsync(payload);
      setActiveAnalysisJob({
        jobId: job.id,
        kind: "answer",
        answerCount: payload.answers.length,
      });
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("activityAnalytics.v2.runFailed"),
      );
    }
  }

  if (!auth.token || projectQuery.isLoading || activityQuery.isLoading) {
    return <AnalyticsErrorState label={t("activityAnalytics.loading")} />;
  }

  if (!projectQuery.data || !activityQuery.data) {
    return <AnalyticsErrorState label={t("activityAnalytics.loadFailed")} />;
  }

  const activity = activityQuery.data;
  const latestAnalysisV2Run = latestAnalysisV2Query.data ?? null;

  return (
    <>
      <TopBar
        crumbs={[
          hierarchy.organizationCrumb,
          hierarchy.projectsCrumb,
          hierarchy.projectCrumb,
          { label: hierarchy.activitiesLabel },
          { label: activity.name },
          { label: t("activityAnalytics.crumb") },
        ]}
      />
      <PageContainer className="py-8">
        <PageHeader
          eyebrow={t("activityAnalytics.eyebrow")}
          title={t("activityAnalytics.title")}
        />
        <ActivityTabs
          projectId={projectId}
          activityId={activityId}
          className="mt-6"
        />

        <div className="mt-6 space-y-5">
          <ActivityAnalysisV2Panel
            activityName={activity.name}
            latestRun={latestAnalysisV2Run}
            latestError={
              latestAnalysisV2Query.isError ? latestAnalysisV2Query.error : null
            }
            isLoading={latestAnalysisV2Query.isLoading}
            onRun={handleRunActivityAnalysisV2}
            isRunning={
              runAnalysisV2Mutation.isPending ||
              activeAnalysisJob?.kind === "run"
            }
            onAnswerQuestions={handleAnswerQuestions}
            isAnsweringQuestions={
              answerQuestionsMutation.isPending ||
              activeAnalysisJob?.kind === "answer"
            }
            previousRuns={analysisV2RunsQuery.data ?? null}
          />
        </div>
      </PageContainer>
    </>
  );
}
