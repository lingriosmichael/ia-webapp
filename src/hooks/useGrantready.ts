import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { sessionQueryKey } from "@/hooks/useAuth";
import {
  type AnswerInterpretationQuestionPayload,
  type ApprovePrivacyReviewResponse,
  ApiError,
  apiClient,
  type ActivitySummary,
  type CreateActivityPayload,
  type CreateOrganizationPayload,
  type CreateProjectPayload,
  type DeleteActivityResponse,
  type DeleteEvidenceResponse,
  type DeleteProjectPayload,
  type DeleteProjectResponse,
  type InterpretationIndicatorStatus,
  type InterpretationResultRecord,
  type InvitationAcceptanceSummary,
  type InvitationSummary,
  type OrganizationMemberSummary,
  type OrganizationWorkspace,
  type ProcessingJobRecord,
  type PrivacyReviewDecisionsInput,
  type PrivacyReviewRecord,
  type ProjectInterpretationOverview,
  type ProjectOverview,
  type ProjectSummary,
  type ResultRecord,
  type SessionResponse,
  type StartInterpretationResponse,
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
export const activityQueryKey = (activityId: string) =>
  ["activity", activityId] as const;
export const activityUploadsQueryKey = (activityId: string) =>
  ["activity-uploads", activityId] as const;
export const activityJobsQueryKey = (activityId: string) =>
  ["activity-jobs", activityId] as const;
export const activityResultsQueryKey = (activityId: string) =>
  ["activity-results", activityId] as const;
export const jobQueryKey = (jobId: string) => ["job", jobId] as const;
export const privacyReviewQueryKey = (processingJobId: string) =>
  ["privacy-review", processingJobId] as const;
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

export function useProjectOverviewQuery(projectId: string, enabled = true) {
  return useQuery<ProjectOverview, ApiError>({
    queryKey: projectOverviewQueryKey(projectId),
    queryFn: () => apiClient.getProjectOverview(projectId),
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

export function useActivityResultsQuery(activityId: string, enabled = true) {
  return useQuery<ResultRecord[], ApiError>({
    queryKey: activityResultsQueryKey(activityId),
    queryFn: () => apiClient.listActivityResults(activityId),
    enabled,
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

export function useInterpretationQuery(
  interpretationResultId: string | undefined,
  enabled = true,
) {
  return useQuery<InterpretationResultRecord, ApiError>({
    queryKey: interpretationQueryKey(interpretationResultId ?? "missing"),
    queryFn: () => apiClient.getInterpretation(interpretationResultId!),
    enabled: enabled && Boolean(interpretationResultId),
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
    onSuccess: (project) => {
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
      void queryClient.invalidateQueries({
        queryKey: projectQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectOverviewQueryKey(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceQueryKey(organizationId),
      });
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
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
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
      void queryClient.invalidateQueries({
        queryKey: activityUploadsQueryKey(activityId),
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

export function useStartInterpretationMutation(
  activityId: string,
  projectId?: string,
) {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  return useMutation<StartInterpretationResponse, ApiError, string>({
    mutationFn: (uploadMetadataId: string) => {
      const language =
        (i18n.resolvedLanguage ?? i18n.language).toLowerCase().slice(0, 2) ===
        "en"
          ? "en"
          : "de";

      return apiClient.startInterpretation(uploadMetadataId, { language });
    },
    onSuccess: ({ job }) => {
      queryClient.setQueryData(jobQueryKey(job.id), job);
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

export function useAnswerInterpretationQuestionMutation(
  interpretationResultId: string,
  projectId?: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<
    InterpretationResultRecord,
    ApiError,
    { questionId: string; payload: AnswerInterpretationQuestionPayload }
  >({
    mutationFn: ({ questionId, payload }) =>
      apiClient.answerInterpretationQuestion(
        interpretationResultId,
        questionId,
        payload,
      ),
    onSuccess: (result) => {
      queryClient.setQueryData(
        interpretationQueryKey(interpretationResultId),
        result,
      );
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

function useSetInterpretationItemStatusMutation<
  TVariables extends { status: InterpretationIndicatorStatus },
>(
  interpretationResultId: string,
  projectId: string | undefined,
  organizationId: string | undefined,
  mutationFn: (variables: TVariables) => Promise<InterpretationResultRecord>,
) {
  const queryClient = useQueryClient();

  return useMutation<InterpretationResultRecord, ApiError, TVariables>({
    mutationFn,
    onSuccess: (result) => {
      queryClient.setQueryData(
        interpretationQueryKey(interpretationResultId),
        result,
      );
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

export function useSetIndicatorStatusMutation(
  interpretationResultId: string,
  projectId?: string,
  organizationId?: string,
) {
  return useSetInterpretationItemStatusMutation(
    interpretationResultId,
    projectId,
    organizationId,
    ({
      indicatorId,
      status,
    }: {
      indicatorId: string;
      status: InterpretationIndicatorStatus;
    }) =>
      apiClient.setIndicatorStatus(interpretationResultId, indicatorId, status),
  );
}

export function useSetQualitativeFindingStatusMutation(
  interpretationResultId: string,
  projectId?: string,
  organizationId?: string,
) {
  return useSetInterpretationItemStatusMutation(
    interpretationResultId,
    projectId,
    organizationId,
    ({
      qualitativeFindingId,
      status,
    }: {
      qualitativeFindingId: string;
      status: InterpretationIndicatorStatus;
    }) =>
      apiClient.setQualitativeFindingStatus(
        interpretationResultId,
        qualitativeFindingId,
        status,
      ),
  );
}

export function useSetSupportingQuoteStatusMutation(
  interpretationResultId: string,
  projectId?: string,
  organizationId?: string,
) {
  return useSetInterpretationItemStatusMutation(
    interpretationResultId,
    projectId,
    organizationId,
    ({
      supportingQuoteId,
      status,
    }: {
      supportingQuoteId: string;
      status: InterpretationIndicatorStatus;
    }) =>
      apiClient.setSupportingQuoteStatus(
        interpretationResultId,
        supportingQuoteId,
        status,
      ),
  );
}

export function useAcknowledgeInterpretationReviewMutation(
  activityId: string,
  organizationId?: string,
) {
  const queryClient = useQueryClient();

  return useMutation<ActivitySummary, ApiError>({
    mutationFn: () => apiClient.acknowledgeInterpretationReview(activityId),
    onSuccess: (activity) => {
      queryClient.setQueryData(activityQueryKey(activityId), activity);
      void queryClient.invalidateQueries({
        queryKey: activityQueryKey(activityId),
      });
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
      queryClient.removeQueries({
        queryKey: activityResultsQueryKey(activityId),
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
