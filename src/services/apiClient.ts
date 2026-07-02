import { getAccessToken } from "./authStorage";

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

interface ApiFailureEnvelope {
  success: false;
  error: ApiErrorPayload;
}

export type OrganizationRole = "ORGANIZATION_ADMIN" | "PROJECT_MANAGER";
export type ProjectStatus = "planning" | "active" | "completed";
export type ActivityStatus = "planning" | "active" | "completed";

export interface OrganizationPermissions {
  canManageProfile: boolean;
  canManageMembers: boolean;
  canManageBilling: boolean;
  canManageSettings: boolean;
  canCreateProject: boolean;
}

export interface ProjectPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canCreateActivity: boolean;
  canUploadEvidence: boolean;
}

export interface ActivityPermissions {
  canEdit: boolean;
  canUploadEvidence: boolean;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  mission: string | null;
  logoUrl: string | null;
  role: OrganizationRole;
  permissions: OrganizationPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationPayload {
  name: string;
  mission: string;
  logoFile?: File | null;
}

export interface CreateOrganizationPayload {
  name: string;
}

export interface ProjectSummary {
  id: string;
  organizationId: string;
  ownerId: string;
  ownerName: string | null;
  name: string;
  slug: string;
  description: string | null;
  programGoal: string | null;
  startMonth: string | null;
  endMonth: string | null;
  country: string | null;
  regionCity: string | null;
  sdgs: string[];
  targetBeneficiaries: string[];
  fundingSource: string | null;
  status: ProjectStatus;
  permissions: ProjectPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitySummary {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  description: string | null;
  activityType: string | null;
  owner: string | null;
  startDate: string | null;
  endDate: string | null;
  objectives: string | null;
  expectedOutcomes: string | null;
  successIndicators: string | null;
  targetAudience: string | null;
  additionalContext: string | null;
  beneficiaryGroup: string | null;
  status: ActivityStatus;
  permissions: ActivityPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMemberSummary {
  id: string;
  userId: string;
  organizationId: string;
  fullName: string;
  email: string;
  role: OrganizationRole;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationSummary {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  role: "PROJECT_MANAGER";
  acceptanceMode: "create_account" | "sign_in";
  status: "pending" | "accepted" | "revoked";
  token: string;
  invitedById: string;
  acceptedById: string | null;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationAcceptanceSummary {
  invitation: InvitationSummary;
  acceptanceMode: InvitationSummary["acceptanceMode"];
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  programGoal?: string;
  startMonth?: string;
  endMonth?: string;
  country?: string;
  regionCity?: string;
  sdgs?: string[];
  targetBeneficiaries?: string[];
  fundingSource?: string;
  status?: ProjectStatus;
}

export interface DeleteProjectPayload {
  projectName: string;
}

export interface DeleteProjectResponse {
  id: string;
  organizationId: string;
}

export interface CreateActivityPayload {
  name: string;
  description?: string;
  activityType?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  objectives?: string;
  expectedOutcomes?: string;
  successIndicators?: string;
  targetAudience?: string;
  beneficiaryGroup?: string;
  status?: ActivityStatus;
}

export interface WorkspaceActivity extends ActivitySummary {
  uploadMetadataCount: number;
  processingJobCount: number;
  resultCount: number;
}

export interface WorkspaceProject extends ProjectSummary {
  activities: WorkspaceActivity[];
}

export interface OrganizationWorkspace {
  organization: OrganizationSummary;
  projects: WorkspaceProject[];
}

export type ProjectRecentActivityType =
  | "activity_created"
  | "dataset_uploaded"
  | "job_completed"
  | "job_failed"
  | "insight_generated";

export interface ProjectRecentActivityItem {
  id: string;
  type: ProjectRecentActivityType;
  occurredAt: string;
  activityId: string | null;
  activityName: string | null;
}

export interface ProjectOverviewMetrics {
  activityCount: number;
  uploadedDatasetCount: number;
  activitiesWithDatasetsCount: number;
  insightCount: number;
  pendingInsightCount: number;
  failedJobCount: number;
  lastUploadAt: string | null;
}

export interface ProjectOverview {
  project: ProjectSummary;
  activities: WorkspaceActivity[];
  metrics: ProjectOverviewMetrics;
  recentActivity: ProjectRecentActivityItem[];
}

export interface UploadMetadataRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  originalFileName: string;
  contentType: string | null;
  sizeBytes: number | null;
  storageKey: string | null;
  status: "pending" | "uploaded" | "archived";
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingJobRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string | null;
  jobType: "semantic_ingestion" | "manual_review" | "export" | "other";
  status: "queued" | "processing" | "completed" | "failed";
  triggeredById: string;
  payload: Record<string, unknown> | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ResultRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string | null;
  processingJobId: string | null;
  resultType:
    "semantic_summary" | "activity_snapshot" | "project_snapshot" | "other";
  status: "pending" | "available" | "archived";
  payload: Record<string, unknown> | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresInSeconds: number;
  user: UserSummary;
  organizations: OrganizationSummary[];
}

export interface SessionResponse {
  user: UserSummary;
  organizations: OrganizationSummary[];
}

export interface ActivityUploadResponse {
  upload: UploadMetadataRecord;
  job: ProcessingJobRecord;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code = "api_error",
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export function resolveApiUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = text
    ? (JSON.parse(text) as ApiEnvelope<T> | ApiFailureEnvelope)
    : undefined;

  if (!response.ok) {
    if (
      payload &&
      typeof payload === "object" &&
      "success" in payload &&
      payload.success === false
    ) {
      throw new ApiError(
        payload.error.message,
        response.status,
        payload.error.code,
        payload.error.details,
      );
    }

    throw new ApiError("Request failed.", response.status);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("success" in payload) ||
    payload.success !== true
  ) {
    throw new ApiError("Malformed API response.", response.status);
  }

  return payload.data;
}

export const apiClient = {
  register(payload: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return request("/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  login(payload: { email: string; password: string }): Promise<AuthResponse> {
    return request("/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  getSession(): Promise<SessionResponse> {
    return request("/auth/me");
  },
  createOrganization(
    payload: CreateOrganizationPayload,
  ): Promise<OrganizationSummary> {
    return request("/organizations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  getWorkspace(organizationId: string): Promise<OrganizationWorkspace> {
    return request(`/organizations/${organizationId}/workspace`);
  },
  listOrganizationMembers(
    organizationId: string,
  ): Promise<OrganizationMemberSummary[]> {
    return request(`/organizations/${organizationId}/members`);
  },
  removeOrganizationMember(
    organizationId: string,
    membershipId: string,
  ): Promise<{ id: string; userId: string; organizationId: string; role: OrganizationRole }> {
    return request(`/organizations/${organizationId}/members/${membershipId}`, {
      method: "DELETE",
    });
  },
  listOrganizationInvitations(
    organizationId: string,
  ): Promise<InvitationSummary[]> {
    return request(`/organizations/${organizationId}/invitations`);
  },
  createOrganizationInvitation(
    organizationId: string,
    payload: { email: string; role: "PROJECT_MANAGER" },
  ): Promise<InvitationSummary> {
    return request(`/organizations/${organizationId}/invitations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  revokeOrganizationInvitation(
    organizationId: string,
    invitationId: string,
  ): Promise<InvitationSummary> {
    return request(`/organizations/${organizationId}/invitations/${invitationId}`, {
      method: "DELETE",
    });
  },
  getInvitation(token: string): Promise<InvitationSummary> {
    return request(`/invitations/${token}`);
  },
  acceptInvitation(
    token: string,
    payload: { fullName?: string; password?: string },
  ): Promise<InvitationAcceptanceSummary> {
    return request(`/invitations/${token}/accept`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  updateOrganization(
    organizationId: string,
    payload: UpdateOrganizationPayload,
  ): Promise<OrganizationSummary> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("mission", payload.mission);

    if (payload.logoFile) {
      formData.append("logo", payload.logoFile);
    }

    return request(`/organizations/${organizationId}`, {
      method: "PATCH",
      body: formData,
    });
  },
  createProject(
    organizationId: string,
    payload: CreateProjectPayload,
  ): Promise<ProjectSummary> {
    return request(`/organizations/${organizationId}/projects`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  getProject(projectId: string): Promise<ProjectSummary> {
    return request(`/projects/${projectId}`);
  },
  deleteProject(
    projectId: string,
    payload: DeleteProjectPayload,
  ): Promise<DeleteProjectResponse> {
    return request(`/projects/${projectId}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  getProjectOverview(projectId: string): Promise<ProjectOverview> {
    return request(`/projects/${projectId}/overview`);
  },
  listProjectActivities(projectId: string): Promise<ActivitySummary[]> {
    return request(`/projects/${projectId}/activities`);
  },
  createActivity(
    projectId: string,
    payload: CreateActivityPayload,
  ): Promise<ActivitySummary> {
    return request(`/projects/${projectId}/activities`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  getActivity(activityId: string): Promise<ActivitySummary> {
    return request(`/activities/${activityId}`);
  },
  listActivityUploads(activityId: string): Promise<UploadMetadataRecord[]> {
    return request(`/activities/${activityId}/upload-metadata`);
  },
  listActivityJobs(activityId: string): Promise<ProcessingJobRecord[]> {
    return request(`/activities/${activityId}/jobs`);
  },
  listActivityResults(activityId: string): Promise<ResultRecord[]> {
    return request(`/activities/${activityId}/results`);
  },
  uploadActivityFile(
    activityId: string,
    file: File,
  ): Promise<ActivityUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return request(`/activities/${activityId}/uploads`, {
      method: "POST",
      body: formData,
    });
  },
  getJob(jobId: string): Promise<ProcessingJobRecord> {
    return request(`/jobs/${jobId}`);
  },
};
