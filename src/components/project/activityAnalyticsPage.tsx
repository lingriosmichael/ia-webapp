import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ActivityTabs } from "@/components/activityTabs";
import { PageHeader, PageContainer, TopBar } from "@/components/WorkspaceUI";
import { useProjectHierarchy } from "@/contexts/projectWorkspaceContext";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  useAcknowledgeInterpretationReviewMutation,
  useActivityAnalysisV2RunsQuery,
  useAnswerActivityAnalysisV2QuestionMutation,
  useActivityQuery,
  useLatestActivityAnalysisV2Query,
  useProjectQuery,
  useRunActivityAnalysisV2Mutation,
} from "@/hooks/useWorkspaceQueries";
import { AnalyticsErrorState } from "@/components/analytics/analyticsEmptyState";
import { ActivityAnalysisV2Panel } from "@/components/project/activityAnalysisV2Panel";
import { ApiError } from "@/services/apiClient";

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
  const answerQuestionMutation =
    useAnswerActivityAnalysisV2QuestionMutation(activityId);
  const acknowledgeMutation = useAcknowledgeInterpretationReviewMutation(
    activityId,
    projectQuery.data?.organizationId,
  );
  const { t } = useTranslation();
  const hierarchy = useProjectHierarchy();

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
      const run = await runAnalysisV2Mutation.mutateAsync();
      // A pipeline failure (grounding failure, timeout, tool error) is
      // returned as a normal 200 response with status "failed" — it does
      // not throw. Both paths must tell the user to run it again.
      if (run.status === "failed") {
        toast.error(t("activityAnalytics.v2.runFailed"));
      } else {
        toast.success(t("activityAnalytics.v2.runSuccess"));
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : t("activityAnalytics.v2.runFailed"),
      );
    }
  }

  async function handleAnswerQuestion(input: {
    questionId: string;
    answeredValue: string;
  }) {
    try {
      const run = await answerQuestionMutation.mutateAsync({
        questionId: input.questionId,
        payload: { answeredValue: input.answeredValue },
      });
      if (run.status === "failed") {
        toast.error(t("activityAnalytics.v2.runFailed"));
      } else {
        toast.success(t("activityAnalytics.v2.clarificationAnswered"));
      }
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
            isRunning={runAnalysisV2Mutation.isPending}
            onAnswerQuestion={handleAnswerQuestion}
            isAnsweringQuestion={answerQuestionMutation.isPending}
            previousRuns={analysisV2RunsQuery.data ?? null}
          />
        </div>
      </PageContainer>
    </>
  );
}
