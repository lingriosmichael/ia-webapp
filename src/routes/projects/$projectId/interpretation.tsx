import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  CircleHelp,
  MessagesSquare,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectWorkspaceShell } from "@/components/project/projectWorkspaceShell";
import { Card } from "@/components/workspaceUI";
import { useCurrentWorkspaceProject } from "@/contexts/projectWorkspaceContext";
import {
  useActivityJobsQuery,
  useActivityResultsQuery,
  useActivityUploadsQuery,
  useProjectOverviewQuery,
} from "@/hooks/useGrantready";
import { useRequireAuth } from "@/hooks/useAuth";
import type { WorkspaceActivity } from "@/services/apiClient";

export const Route = createFileRoute("/projects/$projectId/interpretation")({
  component: ProjectInterpretationPage,
});

function ProjectInterpretationPage() {
  const { projectId } = Route.useParams();
  const auth = useRequireAuth();
  const { t } = useTranslation();
  const workspaceProject = useCurrentWorkspaceProject();
  const overviewQuery = useProjectOverviewQuery(projectId, Boolean(auth.token));
  const [draftPrompt, setDraftPrompt] = useState("");

  const activities = workspaceProject?.activities ?? [];
  const totalUploads = activities.reduce(
    (total, activity) => total + activity.uploadMetadataCount,
    0,
  );
  const totalResults = activities.reduce(
    (total, activity) => total + activity.resultCount,
    0,
  );
  const questionsRemaining = Math.max(totalUploads - totalResults, 0);
  const confidencePercent =
    totalUploads === 0 ? 0 : Math.min(100, Math.round((totalResults / totalUploads) * 100));
  const readyForAnalytics =
    Boolean(overviewQuery.data) &&
    overviewQuery.data.metrics.activitiesWithDatasetsCount > 0 &&
    overviewQuery.data.metrics.failedJobCount === 0;

  const quickPrompts = useMemo(
    () => [
      t("projectWorkspace.interpretation.prompts.attendance"),
      t("projectWorkspace.interpretation.prompts.ignoreColumn"),
      t("projectWorkspace.interpretation.prompts.renameIndicator"),
      t("projectWorkspace.interpretation.prompts.excludeCancelled"),
    ],
    [t],
  );

  return (
    <ProjectWorkspaceShell>
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <WandSparkles className="h-4 w-4 text-primary" />
          {t("projectWorkspace.interpretation.title")}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("projectWorkspace.interpretation.description")}
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric
                  label={t("projectWorkspace.interpretation.metrics.understanding")}
                  value={`${confidencePercent}%`}
                />
                <SummaryMetric
                  label={t("projectWorkspace.interpretation.metrics.uploads")}
                  value={String(totalUploads)}
                />
                <SummaryMetric
                  label={t("projectWorkspace.interpretation.metrics.indicators")}
                  value={String(totalResults)}
                />
                <SummaryMetric
                  label={t("projectWorkspace.interpretation.metrics.questions")}
                  value={String(questionsRemaining)}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <ProgressCard
                  title={t("projectWorkspace.interpretation.progress.title")}
                  items={[
                    {
                      done: totalUploads > 0,
                      label: t("projectWorkspace.interpretation.progress.read"),
                    },
                    {
                      done: totalUploads > 0,
                      label: t("projectWorkspace.interpretation.progress.detect"),
                    },
                    {
                      done: totalResults > 0,
                      label: t("projectWorkspace.interpretation.progress.link"),
                    },
                    {
                      done: readyForAnalytics,
                      label: t("projectWorkspace.interpretation.progress.ready"),
                    },
                  ]}
                />
                <DatasetSummaryCard
                  files={totalUploads}
                  activities={activities.length}
                  readyForAnalytics={readyForAnalytics}
                />
              </div>
            </Card>

            <div className="space-y-4">
              <SectionTitle
                icon={<Sparkles className="h-4 w-4 text-primary" />}
                title={t("projectWorkspace.interpretation.understoodTitle")}
              />
              {activities.length === 0 ? (
                <Card className="p-5 text-sm text-muted-foreground">
                  {t("projectWorkspace.interpretation.empty")}
                </Card>
              ) : (
                activities.map((activity) => (
                  <InterpretationActivityCard
                    key={activity.id}
                    activity={activity}
                    projectId={projectId}
                  />
                ))
              )}
            </div>

            <div className="space-y-4">
              <SectionTitle
                icon={<CircleHelp className="h-4 w-4 text-primary" />}
                title={t("projectWorkspace.interpretation.questionsTitle")}
              />
              {activities
                .filter((activity) => activity.uploadMetadataCount > activity.resultCount)
                .slice(0, 3)
                .map((activity) => (
                  <QuestionCard
                    key={activity.id}
                    title={activity.name}
                    question={t("projectWorkspace.interpretation.defaultQuestion")}
                  />
                ))}
              {activities.every(
                (activity) => activity.uploadMetadataCount <= activity.resultCount,
              ) ? (
                <Card className="p-5 text-sm text-muted-foreground">
                  {t("projectWorkspace.interpretation.noQuestions")}
                </Card>
              ) : null}
            </div>
          </div>

          <Card className="h-fit p-5">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              <MessagesSquare className="h-4 w-4 text-primary" />
              {t("projectWorkspace.interpretation.askPanelTitle")}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("projectWorkspace.interpretation.askPanelDescription")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraftPrompt(prompt)}
                  className="rounded-full border border-border bg-secondary/20 px-3 py-1.5 text-sm text-foreground hover:bg-secondary"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <div className="text-sm text-foreground">
                {draftPrompt ||
                  t("projectWorkspace.interpretation.askPanelPlaceholder")}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm leading-6 text-primary">
              {t("projectWorkspace.interpretation.askPanelNote")}
            </div>
          </Card>
        </div>
      </section>
    </ProjectWorkspaceShell>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function ProgressCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ done: boolean; label: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2
              className={`h-4 w-4 ${item.done ? "text-primary" : "text-border"}`}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DatasetSummaryCard({
  files,
  activities,
  readyForAnalytics,
}: {
  files: number;
  activities: number;
  readyForAnalytics: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {t("projectWorkspace.interpretation.datasetSummaryTitle")}
      </div>
      <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div>{t("projectWorkspace.interpretation.datasetSummaryFiles", { count: files })}</div>
        <div>
          {t("projectWorkspace.interpretation.datasetSummaryActivities", {
            count: activities,
          })}
        </div>
        <div>
          {readyForAnalytics
            ? t("projectWorkspace.interpretation.ready")
            : t("projectWorkspace.interpretation.notReady")}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
      {icon}
      {title}
    </div>
  );
}

function InterpretationActivityCard({
  activity,
  projectId,
}: {
  activity: WorkspaceActivity;
  projectId: string;
}) {
  const uploadsQuery = useActivityUploadsQuery(activity.id, true);
  const jobsQuery = useActivityJobsQuery(activity.id, true);
  const resultsQuery = useActivityResultsQuery(activity.id, true);
  const { t } = useTranslation();
  const latestUpload = uploadsQuery.data?.find((upload) => upload.status !== "archived");
  const latestJob = jobsQuery.data?.[0];
  const latestResult = resultsQuery.data?.find((result) => result.status === "available");

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
            {activity.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {latestUpload?.originalFileName ??
              t("projectWorkspace.interpretation.noEvidenceYet")}
          </p>
        </div>
        <LinkToActivity projectId={projectId} activityId={activity.id} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SignalBox
          label={t("projectWorkspace.interpretation.cardMeaning")}
          value={
            latestResult
              ? t("projectWorkspace.interpretation.cardMeaningResolved")
              : t("projectWorkspace.interpretation.cardMeaningPending")
          }
        />
        <SignalBox
          label={t("projectWorkspace.interpretation.cardConfidence")}
          value={
            latestResult
              ? t("projectWorkspace.interpretation.confidenceHigh")
              : latestJob?.status === "completed"
                ? t("projectWorkspace.interpretation.confidenceMedium")
                : t("projectWorkspace.interpretation.confidenceLow")
          }
        />
        <SignalBox
          label={t("projectWorkspace.interpretation.cardReason")}
          value={
            latestResult
              ? t("projectWorkspace.interpretation.cardReasonResolved")
              : t("projectWorkspace.interpretation.cardReasonPending")
          }
        />
      </div>
    </Card>
  );
}

function LinkToActivity({
  projectId,
  activityId,
}: {
  projectId: string;
  activityId: string;
}) {
  const { t } = useTranslation();

  return (
    <Link
      to="/projects/$projectId/activities/$activityId/overview"
      params={{ projectId, activityId }}
      className="text-sm font-medium text-primary hover:underline"
    >
      {t("projectWorkspace.activities.openActivity")}
    </Link>
  );
}

function SignalBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function QuestionCard({
  title,
  question,
}: {
  title: string;
  question: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{question}</p>
    </Card>
  );
}
