import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { sessionQueryKey } from "@/hooks/useAuth";
import {
  type AnswerActivityAnalysisV2QuestionsPayload,
  type AnswerInterpretationQuestionsPayload,
  type ApprovePrivacyReviewResponse,
  ApiError,
  apiClient,
  type ActivityEvidenceLinkageResultRecord,
  type ActivitySummary,
  type ActivityAnalysisRunV2Record,
  type ApproveQualitativeCodingReviewResponse,
  type CreateActivityPayload,
  type CreateOrganizationPayload,
  type CreateProjectPayload,
  type DeleteActivityResponse,
  type DeleteEvidenceResponse,
  type DeleteProjectPayload,
  type DeleteProjectResponse,
  type InterpretationResultRecord,
  type InvitationAcceptanceSummary,
  type InvitationSummary,
  type OrganizationMemberSummary,
  type OrganizationWorkspace,
  type OutcomeEvidenceCandidate,
  type OutcomeEvidenceConfirmedLink,
  type OutcomeEvidenceLink,
  type OutcomeEvidenceRecommendation,
  type ProcessingJobRecord,
  type PrivacyReviewDecisionsInput,
  type PrivacyReviewRecord,
  type ProjectOutcomeStatement,
  type QualitativeCodingReviewDecisionsInput,
  type QualitativeCodingReviewRecord,
  type ProjectImpactStoryReadResult,
  type ProjectInterpretationOverview,
  type ProjectOverview,
  type ProjectSummary,
  type SessionResponse,
  type StartActivityInterpretationResponse,
  type UpdateProjectPayload,
  type UpdateActivityPayload,
  type UploadMetadataRecord,
} from "@/services/apiClient";

export const workspaceQueryKey = (organizationId: string) =>
  ["workspace", organizationId] as const;
export const projectQueryKey = (projectId: string) =>
  ["project", projectId] as const;
export const projectOverviewQueryKey = (projectId: string) =>
  ["project-overview", projectId] as const;
export const projectActivitiesQueryKey = (projectId: string) =>
  ["project-activities", projectId] as const;
export const projectOutcomeStatementsQueryKey = (projectId: string) =>
  ["project-outcome-statements", projectId] as const;
export const activityQueryKey = (activityId: string) =>
  ["activity", activityId] as const;
export const activityUploadsQueryKey = (activityId: string) =>
  ["activity-uploads", activityId] as const;
export const activityJobsQueryKey = (activityId: string) =>
  ["activity-jobs", activityId] as const;
export const activityWorkflowStageQueryKey = (activityId: string) =>
  ["activity-workflow-stage", activityId] as const;
export const activityLinkageReviewQueryKey = (activityId: string) =>
  ["activity-linkage-review", activityId] as const;
export const activityAnalysisV2LatestQueryKey = (activityId: string) =>
  ["activity-analysis-v2-latest", activityId] as const;
export const activityAnalysisV2RunsQueryKey = (activityId: string) =>
  ["activity-analysis-v2-runs", activityId] as const;
export const outcomeEvidenceRecommendationsQueryKey = (
  projectId: string,
  activityId: string,
) => ["outcome-evidence-recommendations", projectId, activityId] as const;
export const outcomeEvidenceConfirmedLinksQueryKey = (
  projectId: string,
  activityId: string,
) => ["outcome-evidence-links", projectId, activityId] as const;
export const outcomeEvidenceCandidatesQueryKey = (
  projectId: string,
  activityId: string,
) => ["outcome-evidence-candidates", projectId, activityId] as const;
export const jobQueryKey = (jobId: string) => ["job", jobId] as const;
export const privacyReviewQueryKey = (processingJobId: string) =>
  ["privacy-review", processingJobId] as const;
export const qualitativeCodingReviewQueryKey = (uploadMetadataId: string) =>
  ["qualitative-coding-review", uploadMetadataId] as const;
export const projectInterpretationsQueryKey = (projectId: string) =>
  ["project-interpretations", projectId] as const;
export const interpretationQueryKey = (interpretationResultId: string) =>
  ["interpretation", interpretationResultId] as const;
export const organizationMembersQueryKey = (organizationId: string) =>
  ["organization-members", organizationId] as const;
export const organizationInvitationsQueryKey = (organizationId: string) =>
  ["organization-invitations", organizationId] as const;
export const invitationQueryKey = (token: string) =>
  ["invitation", token] as const;
export const projectAnalyticsQueryKey = (projectId: string) =>
  ["project-analytics", projectId] as const;
export const activeProjectAnalyticsJobQueryKey = (projectId: string) =>
  ["project-analytics-active-job", projectId] as const;

export function useOrganizationWorkspaceQuery(
  organizationId: string,
  enabled = true,
) {
  return useQuery<OrganizationWorkspace, ApiError>({
    queryKey: workspaceQueryKey(organizationId),
    queryFn: () => apiClient.getWorkspace(organizationId),
    enabled,
  });
}

export function useOrganizationMembersQuery(
  organizationId: string,
  enabled = true,
) {
  return useQuery<OrganizationMemberSummary[], ApiError>({
    queryKey: organizationMembersQueryKey(organizationId),
    queryFn: () => apiClient.listOrganizationMembers(organizationId),
    enabled,
  });
}

export function useOrganizationInvitationsQuery(
  organizationId: string,
  enabled = true,
) {
  return useQuery<InvitationSummary[], ApiError>({
    queryKey: organizationInvitationsQueryKey(organizationId),
    queryFn: () => apiClient.listOrganizationInvitations(organizationId),
    enabled,
  });
}

export function useInvitationQuery(token: string, enabled = true) {
  return useQuery<InvitationSummary, ApiError>({
    queryKey: invitationQueryKey(token),
    queryFn: () => apiClient.getInvitation(token),
    enabled,
  });
}

export function useProjectQuery(projectId: string, enabled = true) {
  return useQuery<ProjectSummary, ApiError>({
    queryKey: projectQueryKey(projectId),
    queryFn: () => apiClient.getProject(projectId),
    enabled,
  });
}

export function useProjectActivitiesQuery(projectId: string, enabled = true) {
  return useQuery<ActivitySummary[], ApiError>({
    queryKey: projectActivitiesQueryKey(projectId),
    queryFn: () => apiClient.listProjectActivities(projectId),
    enabled,
  });
}

export function useProjectOutcomeStatementsQuery(
  projectId: string,
  enabled = true,
) {
  return useQuery<ProjectOutcomeStatement[], ApiError>({
    queryKey: projectOutcomeStatementsQueryKey(projectId),
    queryFn: () => apiClient.listOutcomeStatements(projectId),
    enabled,
  });
}

export function useActivityQuery(activityId: string, enabled = true) {
  return useQuery<ActivitySummary, ApiError>({
    queryKey: activityQueryKey(activityId),
    queryFn: () => apiClient.getActivity(activityId),
    enabled,
  });
}

export function useActivityUploadsQuery(activityId: string, enabled = true) {
  return useQuery<UploadMetadataRecord[], ApiError>({
    queryKey: activityUploadsQueryKey(activityId),
    queryFn: () => apiClient.listActivityUploads(activityId),
    enabled,
  });
}

export function useActivityJobsQuery(
  activityId: string,
  enabled = true,
  refetchIntervalMs?: number,
) {
  return useQuery<ProcessingJobRecord[], ApiError>({
    queryKey: activityJobsQueryKey(activityId),
    queryFn: () => apiClient.listActivityJobs(activityId),
    enabled,
    refetchInterval: refetchIntervalMs,
  });
}

export function useActivityLinkageReviewQuery(
  activityId: string,
  enabled = true,
) {
  return useQuery<ActivityEvidenceLinkageResultRecord | null, ApiError>({
    queryKey: activityLinkageReviewQueryKey(activityId),
    queryFn: () => apiClient.getActivityLinkageReview(activityId),
    enabled,
  });
}

// Cached under the query client (not the mutation the server call actually
// is under the hood) purely so a result survives the panel unmounting when
// the user switches tabs and comes back — see OutcomeEvidenceRecommendation's
// doc comment in apiClient.ts: there is still no server-side reconciliation
// cache for this flow, and every call is a real LLM call, so `enabled` stays
// false forever and the only way to (re)run it is the explicit `refetch()`
// the "Empfehlungen abrufen" button calls. Nothing here triggers it
// automatically on mount, refocus, or reconnect.
export function useOutcomeEvidenceRecommendationsQuery(
  projectId: string,
  activityId: string,
) {
  return useQuery<
    { recommendations: OutcomeEvidenceRecommendation[] },
    ApiError
  >({
    queryKey: outcomeEvidenceRecommendationsQueryKey(projectId, activityId),
    queryFn: () =>
      apiClient.recommendOutcomeEvidencePairings(projectId, activityId),
    enabled: false,
    retry: false,
    staleTime: Infinity,
  });
}

export function useApproveOutcomeEvidenceRecommendationMutation(
  projectId: string,
  activityId: string,
) {
  const queryClient = useQueryClient();

  return useMutation<
    OutcomeEvidenceLink,
    ApiError,
    OutcomeEvidenceRecommendation
  >({
    mutationFn: (recommendation) =>
      apiClient.approveOutcomeEvidenceRecommendation(
        projectId,
        activityId,
        recommendation,
      ),
    // Confirming a recommendation persists a real OutcomeEvidenceLink,
    // which Project Impact Story's narrative reads directly (see
    // OUTCOME_EVIDENCE_MERGE_PLAN.md/CLAUDE.md) and which can affect this
    // activity's workflow stage — same downstream surfaces
    // useReviewActivityLinkageProposalMutation above invalidates for its
    // own "confirm a server-generated proposal" flow. Without this, those
    // views silently keep serving pre-approval data until an unrelated
    // refetch happens to occur. Also invalidates the confirmed-links list
    // itself (whether this approval came from a recommendation card or the
    // manual-add form), so the persistent summary picks it up immediately.
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: activityWorkflowStageQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectInterpretationsQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectAnalyticsQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: outcomeEvidenceConfirmedLinksQueryKey(projectId, activityId),
      });
    },
  });
}

// Plain, auto-fetching read of already-confirmed OutcomeEvidenceLinks for
// this activity — unlike useOutcomeEvidenceRecommendationsQuery above, this
// is a cheap DB read (no LLM call) meant to reflect real, persisted state
// on every visit, not something a human explicitly triggers each time. This
// is what makes the confirmed-links summary survive a tab switch or a full
// page refresh, where the recommendations panel's own local "just
// confirmed" feedback used to reset to nothing.
export function useOutcomeEvidenceConfirmedLinksQuery(
  projectId: string,
  activityId: string,
  enabled = true,
) {
  return useQuery<{ links: OutcomeEvidenceConfirmedLink[] }, ApiError>({
    queryKey: outcomeEvidenceConfirmedLinksQueryKey(projectId, activityId),
    queryFn: () =>
      apiClient.listOutcomeEvidenceConfirmedLinks(projectId, activityId),
    enabled,
  });
}

// Lazy, like useOutcomeEvidenceRecommendationsQuery — only fetched when the
// "manually add a pairing" form is opened (via refetch()), since most
// visits to this panel never need the raw candidate list.
export function useOutcomeEvidenceCandidatesQuery(
  projectId: string,
  activityId: string,
) {
  return useQuery<{ candidates: OutcomeEvidenceCandidate[] }, ApiError>({
    queryKey: outcomeEvidenceCandidatesQueryKey(projectId, activityId),
    queryFn: () =>
      apiClient.listOutcomeEvidenceCandidates(projectId, activityId),
    enabled: false,
    retry: false,
  });
}

// Bulk counterpart to useRemoveOutcomeEvidenceLinkMutation below — clears
// every confirmed link for one activity in one call. Invalidates the same
// query set useApproveOutcomeEvidenceRecommendationMutation does: clearing
// links is symmetric with confirming them for every downstream surface
// that reads OutcomeEvidenceLinks (workflow stage, Project Impact Story),
// plus the confirmed-links list itself so the panel's recommend section can
// reappear once the count reaches zero.
export function useRemoveAllOutcomeEvidenceConfirmedLinksMutation(
  projectId: string,
  activityId: string,
) {
  const queryClient = useQueryClient();

  return useMutation<{ removed: number }, ApiError, void>({
    mutationFn: () =>
      apiClient.removeAllOutcomeEvidenceConfirmedLinks(projectId, activityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: activityWorkflowStageQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectInterpretationsQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectAnalyticsQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: outcomeEvidenceConfirmedLinksQueryKey(projectId, activityId),
      });
    },
  });
}

export function useLatestActivityAnalysisV2Query(
  activityId: string,
  enabled = true,
) {
  return useQuery<ActivityAnalysisRunV2Record | null, ApiError>({
    queryKey: activityAnalysisV2LatestQueryKey(activityId),
    queryFn: async () => {
      try {
        return await apiClient.getLatestActivityAnalysisV2(activityId);
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.code === "activity_analysis_v2_not_found"
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled,
    retry: false,
  });
}

export function useActivityAnalysisV2RunsQuery(
  activityId: string,
  enabled = true,
) {
  return useQuery<ActivityAnalysisRunV2Record[], ApiError>({
    queryKey: activityAnalysisV2RunsQueryKey(activityId),
    queryFn: () => apiClient.listActivityAnalysisV2Runs(activityId),
    enabled,
  });
}

// Creates an activity_analysis_v2 processing job — it does not return the
// finished run. The caller is expected to poll the job with useJobQuery and
// invalidate the analysis-v2 read queries once the job reaches a terminal
// status (see routes/projects/$projectId/interpretation.tsx); invalidating
// here, on job creation, would be premature since nothing has actually
// changed yet.
export function useRunActivityAnalysisV2Mutation(activityId: string) {
  return useMutation<ProcessingJobRecord, ApiError>({
    mutationFn: () => apiClient.runActivityAnalysisV2(activityId),
  });
}

// Answers a batch of clarification questions in one call, then creates a
// fresh activity_analysis_v2 replan job. Triggers exactly one replan
// regardless of how many answers are in the batch — see
// apiClient.answerActivityAnalysisV2Questions for why that matters. Like
// useRunActivityAnalysisV2Mutation above, the caller polls the returned job
// and invalidates read queries once it's terminal.
export function useAnswerActivityAnalysisV2QuestionsMutation(
  activityId: string,
) {
  return useMutation<
    ProcessingJobRecord,
    ApiError,
    AnswerActivityAnalysisV2QuestionsPayload
  >({
    mutationFn: (payload) =>
      apiClient.answerActivityAnalysisV2Questions(activityId, payload),
  });
}

export function useProjectAnalyticsQuery(projectId: string, enabled = true) {
  return useQuery<ProjectImpactStoryReadResult, ApiError>({
    queryKey: projectAnalyticsQueryKey(projectId),
    queryFn: () => apiClient.getProjectAnalytics(projectId),
    enabled,
  });
}

export function useRunProjectAnalyticsMutation(projectId: string) {
  return useMutation<ProcessingJobRecord, ApiError>({
    mutationFn: () => apiClient.runProjectAnalytics(projectId),
  });
}

// One-shot check, not polled — ProjectImpactStoryPage reads this exactly
// once per mount to discover a run it didn't personally start (see
// apiClient.getActiveProjectAnalyticsJob), then hands off to useJobQuery's
// own polling for the rest of that run's lifetime.
export function useActiveProjectAnalyticsJobQuery(
  projectId: string,
  enabled = true,
) {
  return useQuery<{ job: ProcessingJobRecord | null }, ApiError>({
    queryKey: activeProjectAnalyticsJobQueryKey(projectId),
    queryFn: () => apiClient.getActiveProjectAnalyticsJob(projectId),
    enabled,
  });
}

export function useReviewActivityLinkageProposalMutation(activityId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ActivityEvidenceLinkageResultRecord,
    ApiError,
    { proposalId: string; decision: "accept" | "reject" }
  >({
    mutationFn: ({ proposalId, decision }) =>
      apiClient.reviewActivityLinkageProposal(activityId, proposalId, {
        decision,
      }),
    onSuccess: (result) => {
      queryClient.setQueryData(
        activityLinkageReviewQueryKey(activityId),
        result,
      );
      void queryClient.invalidateQueries({
        queryKey: activityWorkflowStageQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectInterpretationsQueryKey(result.projectId),
      });
    },
  });
}

// Kept even though no current UI action calls it yet — see
// apiClient.ts's removeOutcomeEvidenceLink doc comment.
export function useRemoveOutcomeEvidenceLinkMutation(projectId: string) {
  return useMutation<{ removed: boolean }, ApiError, string>({
    mutationFn: (linkId) =>
      apiClient.removeOutcomeEvidenceLink(projectId, linkId),
  });
}

export function useJobQuery(jobId: string | undefined, enabled = true) {
  return useQuery<ProcessingJobRecord, ApiError>({
    queryKey: jobQueryKey(jobId ?? "missing"),
    queryFn: () => apiClient.syncJob(jobId!),
    enabled: enabled && Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ["completed", "failed", "cancelled"].includes(status)
        ? false
        : 1000;
    },
  });
}

export function usePrivacyReviewQuery(
  processingJobId: string | undefined,
  enabled = true,
) {
  return useQuery<PrivacyReviewRecord, ApiError>({
    queryKey: privacyReviewQueryKey(processingJobId ?? "missing"),
    queryFn: () => apiClient.getPrivacyReview(processingJobId!),
    enabled: enabled && Boolean(processingJobId),
  });
}

export function useQualitativeCodingReviewQuery(
  uploadMetadataId: string | undefined,
  enabled = true,
) {
  return useQuery<QualitativeCodingReviewRecord | null, ApiError>(
    qualitativeCodingReviewQueryOptions(uploadMetadataId, enabled),
  );
}

export function qualitativeCodingReviewQueryOptions(
  uploadMetadataId: string | undefined,
  enabled = true,
) {
  return {
    queryKey: qualitativeCodingReviewQueryKey(uploadMetadataId ?? "missing"),
    queryFn: async () => {
      try {
        return await apiClient.getQualitativeCodingReview(uploadMetadataId!);
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.code === "qualitative_coding_review_not_found"
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled: enabled && Boolean(uploadMetadataId),
    retry: false,
  };
}

export function useProjectInterpretationsQuery(
  projectId: string,
  enabled = true,
) {
  return useQuery<ProjectInterpretationOverview, ApiError>({
    queryKey: projectInterpretationsQueryKey(projectId),
    queryFn: () => apiClient.getProjectInterpretations(projectId),
    enabled,
  });
}

export function useCreateProjectMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      apiClient.createProject(organizationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceQueryKey(organizationId),
      });
    },
  });
}

export function useUpdateProjectMutation(
  projectId: string,
  organizationId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) =>
      apiClient.updateProject(projectId, payload),
    onSuccess: async (project) => {
      queryClient.setQueryData<ProjectSummary>(
        projectQueryKey(projectId),
        project,
      );
      queryClient.setQueryData<ProjectOverview | undefined>(
        projectOverviewQueryKey(projectId),
        (current) => (current ? { ...current, project } : current),
      );
      queryClient.setQueryData<OrganizationWorkspace | undefined>(
        workspaceQueryKey(organizationId),
        (current) =>
          current
            ? {
                ...current,
                projects: current.projects.map((item) =>
                  item.id === project.id ? { ...item, ...project } : item,
                ),
              }
            : current,
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        }),
      ]);
    },
  });
}

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      apiClient.createOrganization(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

export function useDeleteProjectMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: DeleteProjectPayload;
    }) => apiClient.deleteProject(projectId, payload),
    onSuccess: (deletedProject: DeleteProjectResponse) => {
      queryClient.setQueryData<OrganizationWorkspace | undefined>(
        workspaceQueryKey(organizationId),
        (current) =>
          current
            ? {
                ...current,
                projects: current.projects.filter(
                  (project) => project.id !== deletedProject.id,
                ),
              }
            : current,
      );
      queryClient.removeQueries({
        queryKey: projectQueryKey(deletedProject.id),
      });
      queryClient.removeQueries({
        queryKey: projectOverviewQueryKey(deletedProject.id),
      });
      queryClient.removeQueries({
        queryKey: projectActivitiesQueryKey(deletedProject.id),
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceQueryKey(organizationId),
      });
    },
  });
}

export function useUpdateOrganizationMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof apiClient.updateOrganization>[1]) =>
      apiClient.updateOrganization(organizationId, payload),
    onSuccess: (organization) => {
      queryClient.setQueryData<OrganizationWorkspace | undefined>(
        workspaceQueryKey(organizationId),
        (current) =>
          current
            ? {
                ...current,
                organization: {
                  ...current.organization,
                  ...organization,
                },
              }
            : current,
      );
      queryClient.setQueryData<SessionResponse | undefined>(
        sessionQueryKey,
        (current) =>
          current
            ? {
                ...current,
                organizations: current.organizations.map((item) =>
                  item.id === organizationId
                    ? { ...item, ...organization }
                    : item,
                ),
              }
            : current,
      );
      void queryClient.invalidateQueries({
        queryKey: workspaceQueryKey(organizationId),
      });
      void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

export function useCreateInvitationMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { email: string; role: "PROJECT_MANAGER" }) =>
      apiClient.createOrganizationInvitation(organizationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationInvitationsQueryKey(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey(organizationId),
      });
    },
  });
}

export function useRevokeInvitationMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      apiClient.revokeOrganizationInvitation(organizationId, invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationInvitationsQueryKey(organizationId),
      });
    },
  });
}

export function useResendInvitationMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      apiClient.resendOrganizationInvitation(organizationId, invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationInvitationsQueryKey(organizationId),
      });
    },
  });
}

export function useRemoveOrganizationMemberMutation(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: string) =>
      apiClient.removeOrganizationMember(organizationId, membershipId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey(organizationId),
      });
      void queryClient.invalidateQueries({
        queryKey: sessionQueryKey,
      });
    },
  });
}

export function useAcceptInvitationMutation(token: string) {
  const queryClient = useQueryClient();

  return useMutation<
    InvitationAcceptanceSummary,
    ApiError,
    { fullName?: string; password?: string }
  >({
    mutationFn: (payload) => apiClient.acceptInvitation(token, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: invitationQueryKey(token),
      });
      void queryClient.invalidateQueries({
        queryKey: sessionQueryKey,
      });
    },
  });
}

export function useCreateActivityMutation(
  projectId: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateActivityPayload) =>
      apiClient.createActivity(projectId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: projectActivitiesQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectOverviewQueryKey(projectId),
      });
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useUpdateActivityMutation(
  activityId: string,
  projectId: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateActivityPayload) =>
      apiClient.updateActivity(activityId, payload),
    onSuccess: (activity) => {
      queryClient.setQueryData<ActivitySummary>(
        activityQueryKey(activityId),
        activity,
      );
      void queryClient.invalidateQueries({
        queryKey: activityQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectActivitiesQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectOverviewQueryKey(projectId),
      });
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useUploadActivityFileMutation(
  activityId: string,
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiClient.uploadActivityFile(activityId, file),
    onSuccess: () => {
      queryClient.setQueryData(
        activityAnalysisV2LatestQueryKey(activityId),
        null,
      );
      queryClient.setQueryData(activityAnalysisV2RunsQueryKey(activityId), []);
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityAnalysisV2LatestQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityAnalysisV2RunsQueryKey(activityId),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectActivitiesQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectInterpretationsQueryKey(projectId),
        });
      }
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useDeleteEvidenceMutation(
  activityId: string,
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<DeleteEvidenceResponse, ApiError, string>({
    mutationFn: (uploadMetadataId: string) =>
      apiClient.deleteEvidence(uploadMetadataId),
    onSuccess: () => {
      queryClient.setQueryData(
        activityAnalysisV2LatestQueryKey(activityId),
        null,
      );
      queryClient.setQueryData(activityAnalysisV2RunsQueryKey(activityId), []);
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityAnalysisV2LatestQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityAnalysisV2RunsQueryKey(activityId),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectActivitiesQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectInterpretationsQueryKey(projectId),
        });
      }
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useStartEvidenceAnalysisMutation(
  activityId: string,
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uploadMetadataId: string) =>
      apiClient.startEvidenceAnalysis(uploadMetadataId),
    onSuccess: ({ job }) => {
      queryClient.setQueryData(jobQueryKey(job.id), job);
      void queryClient.invalidateQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        });
      }
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useApprovePrivacyReviewMutation(
  activityId: string,
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApprovePrivacyReviewResponse,
    ApiError,
    { processingJobId: string; decisions?: PrivacyReviewDecisionsInput }
  >({
    mutationFn: ({ processingJobId, decisions }) =>
      apiClient.approvePrivacyReview(processingJobId, { decisions }),
    onSuccess: ({ review, job }) => {
      queryClient.setQueryData(jobQueryKey(job.id), job);
      queryClient.setQueryData(
        privacyReviewQueryKey(review.processingJobId),
        review,
      );
      void queryClient.invalidateQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        });
      }
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

// Creates a qualitative_coding_review processing job — it does not return
// the proposal directly. The caller is expected to poll the job with
// useJobQuery and, once it reaches a terminal status, re-fetch the review
// and invalidate the same read queries this hook used to invalidate
// directly in onSuccess (see qualitativeCodingReviewDialog.tsx) —
// invalidating here, on job creation, would be premature since nothing has
// actually changed yet.
export function useGenerateQualitativeCodingReviewMutation() {
  return useMutation<ProcessingJobRecord, ApiError, string>({
    mutationFn: (uploadMetadataId: string) =>
      apiClient.generateQualitativeCodingReview(uploadMetadataId),
  });
}

export function useApproveQualitativeCodingReviewMutation(
  activityId: string,
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApproveQualitativeCodingReviewResponse,
    ApiError,
    {
      uploadMetadataId: string;
      decisions?: QualitativeCodingReviewDecisionsInput;
    }
  >({
    mutationFn: ({ uploadMetadataId, decisions }) =>
      apiClient.approveQualitativeCodingReview(uploadMetadataId, { decisions }),
    onSuccess: ({ review }) => {
      queryClient.setQueryData(
        qualitativeCodingReviewQueryKey(review.uploadMetadataId),
        review,
      );
      void queryClient.invalidateQueries({
        queryKey: activityWorkflowStageQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityAnalysisV2LatestQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectInterpretationsQueryKey(projectId),
        });
      }
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useStartActivityInterpretationMutation(
  activityId: string,
  projectId?: string,
) {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  return useMutation<StartActivityInterpretationResponse, ApiError>({
    mutationFn: () => {
      const language =
        (i18n.resolvedLanguage ?? i18n.language).toLowerCase().slice(0, 2) ===
        "en"
          ? "en"
          : "de";

      return apiClient.startActivityInterpretation(activityId, { language });
    },
    onSuccess: ({ jobs }) => {
      for (const job of jobs) {
        queryClient.setQueryData(jobQueryKey(job.id), job);
      }
      void queryClient.invalidateQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectInterpretationsQueryKey(projectId),
        });
      }
    },
  });
}

// interpretationResultId is a mutate-time argument (not bound at hook
// creation) because a single "answer all pending questions" submit can
// span questions from several different InterpretationResults (one per
// uploaded file) — the caller groups answers by result and reuses this one
// mutation for each group.
export function useAnswerInterpretationQuestionsMutation(
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<
    InterpretationResultRecord,
    ApiError,
    {
      interpretationResultId: string;
      payload: AnswerInterpretationQuestionsPayload;
    }
  >({
    mutationFn: ({ interpretationResultId, payload }) =>
      apiClient.answerInterpretationQuestions(interpretationResultId, payload),
    onSuccess: (result) => {
      queryClient.setQueryData(interpretationQueryKey(result.id), result);
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: projectInterpretationsQueryKey(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectOverviewQueryKey(projectId),
        });
      }
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}

export function useDeleteActivityMutation(
  activityId: string,
  projectId: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<DeleteActivityResponse, ApiError>({
    mutationFn: () => apiClient.deleteActivity(activityId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: activityQueryKey(activityId),
      });
      queryClient.removeQueries({
        queryKey: activityUploadsQueryKey(activityId),
      });
      queryClient.removeQueries({
        queryKey: activityJobsQueryKey(activityId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectActivitiesQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectOverviewQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectQueryKey(projectId),
      });
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceQueryKey(organizationId),
        });
      }
    },
  });
}
