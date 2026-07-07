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
export type ActivityStatus = "active" | "completed";

export interface OrganizationPermissions {
  canManageMembers: boolean;
  canManageBilling: boolean;
  canManageSettings: boolean;
  canCreateProject: boolean;
}

export interface OrganizationSettings {
  organizationName: string;
  legalForm: string | null;
  foundingYear: number | null;
  country: string | null;
  employeeCount: number | null;
  mission: string | null;
  activityAreas: string[];
  targetGroups: string[];
  operatingRegions: string[];
  isRecognizedNonProfit: boolean | null;
  taxExemptionValidFrom: string | null;
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
  mission: string | null;
  logoUrl: string | null;
  memberCount: number | null;
  settings: OrganizationSettings;
  role: OrganizationRole;
  permissions: OrganizationPermissions;
  createdAt: string;
}

export interface UpdateOrganizationPayload {
  settings: OrganizationSettings;
  logoFile?: File | null;
}

export interface CreateOrganizationPayload {
  name: string;
}

export interface ProjectImpactModel {
  inputs: string | null;
  activities: string | null;
  outputs: string | null;
  impact: string | null;
  outcomes: string | null;
}

export interface ProjectSummary {
  id: string;
  organizationId: string;
  ownerId: string;
  ownerName: string | null;
  name: string;
  startMonth: string | null;
  endMonth: string | null;
  fundingProgram: string | null;
  fundingOrganization: string | null;
  targetGroups: string[];
  areaOfOperation: string | null;
  partnerships: string | null;
  sdgs: string[];
  impactModel: ProjectImpactModel;
  successIndicators: string | null;
  status: ProjectStatus;
  permissions: ProjectPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitySummary {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  activityType: string | null;
  owner: string | null;
  startDate: string | null;
  endDate: string | null;
  objectives: string | null;
  successIndicators: string | null;
  targetAudience: string | null;
  additionalContext: string | null;
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
  startMonth: string;
  endMonth: string;
  fundingProgram: string;
  fundingOrganization: string;
  targetGroups: string[];
  areaOfOperation: string;
  partnerships?: string;
  sdgs?: string[];
  impactModel: {
    inputs: string;
    activities: string;
    outputs: string;
    impact: string;
    outcomes: string;
  };
  successIndicators: string;
}

export interface UpdateProjectPayload {
  name?: string;
  startMonth?: string | null;
  endMonth?: string | null;
  fundingProgram?: string | null;
  fundingOrganization?: string | null;
  targetGroups?: string[];
  areaOfOperation?: string | null;
  partnerships?: string | null;
  sdgs?: string[];
  impactModel?: {
    inputs?: string | null;
    activities?: string | null;
    outputs?: string | null;
    impact?: string | null;
    outcomes?: string | null;
  };
  successIndicators?: string | null;
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
  successIndicators?: string;
  targetAudience?: string;
  status?: ActivityStatus;
}

export interface UpdateActivityPayload {
  name?: string;
  description?: string | null;
  activityType?: string | null;
  owner?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  objectives?: string | null;
  successIndicators?: string | null;
  targetAudience?: string | null;
  additionalContext?: string | null;
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
  logicalEvidenceId: string;
  versionNumber: number;
  replacesUploadMetadataId: string | null;
  supersededAt: string | null;
  originalFileName: string;
  contentType: string | null;
  sizeBytes: number | null;
  storageKey: string | null;
  originalFileDeletedAt: string | null;
  status: "pending" | "uploaded" | "archived";
  uploadedById: string;
  uploadedByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingJobRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string | null;
  jobType:
    | "evidence_processing"
    | "dataset_interpretation"
    | "dataset_review"
    | "metrics_generation"
    | "dashboard_generation"
    | "insight_generation"
    | "report_generation"
    | "chat"
    | "other";
  status:
    | "queued"
    | "processing"
    | "awaiting_privacy_review"
    | "transforming"
    | "completed"
    | "failed"
    | "cancelled";
  triggeredById: string;
  payload: Record<string, unknown> | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface StartEvidenceAnalysisResponse {
  job: ProcessingJobRecord;
}

export interface ParsedRepresentationRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string;
  processingJobId: string;
  fileType: "spreadsheet" | "document" | "unknown";
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type PrivacyReviewDecisionValue =
  "exclude" | "continue_with_restriction";

export interface ParsedRepresentationPreviewTable {
  name: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
}

export interface ParsedRepresentationPreviewParagraph {
  index: number;
  page: number | null;
  sourceIndex: number | null;
  characterCount: number;
}

export interface ParsedRepresentationPreviewRecord {
  fileType: "spreadsheet" | "document" | "unknown";
  sourceFileName: string | null;
  extension: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;
  tableCount: number;
  paragraphCount: number;
  tables: ParsedRepresentationPreviewTable[];
  paragraphs: ParsedRepresentationPreviewParagraph[];
}

export interface PrivacyReviewDecisions {
  defaults?: {
    freeTextRisk?: PrivacyReviewDecisionValue;
    specialCategoryData?: PrivacyReviewDecisionValue;
  };
  fieldDecisions?: Array<{
    field: string;
    entityType: "FREE_TEXT_RISK" | "SPECIAL_CATEGORY_DATA";
    decision: PrivacyReviewDecisionValue;
  }>;
}

export interface PrivacyReviewRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string;
  processingJobId: string;
  status: "pending" | "approved" | "rejected";
  findings: Record<string, unknown>;
  parsedRepresentationPreview: ParsedRepresentationPreviewRecord | null;
  decisions: PrivacyReviewDecisions | null;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovePrivacyReviewPayload {
  decisions?: PrivacyReviewDecisions;
}

export interface ApprovePrivacyReviewResponse {
  review: PrivacyReviewRecord;
  job: ProcessingJobRecord;
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
}

export interface DeleteEvidenceResponse {
  id: string;
  activityId: string | null;
  projectId: string;
}

export interface DeleteActivityResponse {
  id: string;
  projectId: string;
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

function resolveConfiguredApiBaseUrl() {
  const configuredValue = import.meta.env.VITE_API_BASE_URL;

  if (!configuredValue) {
    // No silent localhost fallback: an unset VITE_API_BASE_URL in
    // staging/production must fail loudly at load time, not send every
    // request to a wrong (or dead) local address.
    throw new Error(
      "VITE_API_BASE_URL is not set. Configure it in this environment's .env file.",
    );
  }

  return configuredValue;
}

const apiBaseUrl = resolveConfiguredApiBaseUrl();

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

async function requestBlob(path: string, init?: RequestInit): Promise<Blob> {
  const token = getAccessToken();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new ApiError("Request failed.", response.status);
  }

  return response.blob();
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
  ): Promise<{
    id: string;
    userId: string;
    organizationId: string;
    role: OrganizationRole;
  }> {
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
  resendOrganizationInvitation(
    organizationId: string,
    invitationId: string,
  ): Promise<InvitationSummary> {
    return request(
      `/organizations/${organizationId}/invitations/${invitationId}/resend`,
      {
        method: "POST",
      },
    );
  },
  revokeOrganizationInvitation(
    organizationId: string,
    invitationId: string,
  ): Promise<InvitationSummary> {
    return request(
      `/organizations/${organizationId}/invitations/${invitationId}`,
      {
        method: "DELETE",
      },
    );
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
    formData.append("name", payload.settings.organizationName);
    formData.append("mission", payload.settings.mission ?? "");
    formData.append("organizationName", payload.settings.organizationName);
    formData.append("legalForm", payload.settings.legalForm ?? "");
    formData.append(
      "foundingYear",
      payload.settings.foundingYear === null
        ? ""
        : String(payload.settings.foundingYear),
    );
    formData.append("country", payload.settings.country ?? "");
    formData.append(
      "employeeCount",
      payload.settings.employeeCount === null
        ? ""
        : String(payload.settings.employeeCount),
    );
    formData.append(
      "activityAreas",
      JSON.stringify(payload.settings.activityAreas),
    );
    formData.append(
      "targetGroups",
      JSON.stringify(payload.settings.targetGroups),
    );
    formData.append(
      "operatingRegions",
      JSON.stringify(payload.settings.operatingRegions),
    );
    formData.append(
      "isRecognizedNonProfit",
      payload.settings.isRecognizedNonProfit === null
        ? ""
        : String(payload.settings.isRecognizedNonProfit),
    );
    formData.append(
      "taxExemptionValidFrom",
      payload.settings.taxExemptionValidFrom ?? "",
    );

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
  updateProject(
    projectId: string,
    payload: UpdateProjectPayload,
  ): Promise<ProjectSummary> {
    return request(`/projects/${projectId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
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
  updateActivity(
    activityId: string,
    payload: UpdateActivityPayload,
  ): Promise<ActivitySummary> {
    return request(`/activities/${activityId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  deleteActivity(activityId: string): Promise<DeleteActivityResponse> {
    return request(`/activities/${activityId}`, {
      method: "DELETE",
    });
  },
  listActivityUploads(activityId: string): Promise<UploadMetadataRecord[]> {
    return request(`/activities/${activityId}/evidence`);
  },
  deleteEvidence(evidenceId: string): Promise<DeleteEvidenceResponse> {
    return request(`/evidence/${evidenceId}`, {
      method: "DELETE",
    });
  },
  startEvidenceAnalysis(
    evidenceId: string,
  ): Promise<StartEvidenceAnalysisResponse> {
    return request(`/evidence/${evidenceId}/analyse`, {
      method: "POST",
    });
  },
  downloadUploadMetadataFile(uploadMetadataId: string): Promise<Blob> {
    return requestBlob(`/evidence/${uploadMetadataId}/file`);
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

    return request(`/activities/${activityId}/evidence`, {
      method: "POST",
      body: formData,
    });
  },
  getJob(jobId: string): Promise<ProcessingJobRecord> {
    return request(`/jobs/${jobId}`);
  },
  syncJob(jobId: string): Promise<ProcessingJobRecord> {
    return request(`/jobs/${jobId}/sync`, {
      method: "POST",
    });
  },
  getPrivacyReview(processingJobId: string): Promise<PrivacyReviewRecord> {
    return request(`/privacy-review/${processingJobId}`);
  },
  approvePrivacyReview(
    processingJobId: string,
    payload: ApprovePrivacyReviewPayload,
  ): Promise<ApprovePrivacyReviewResponse> {
    return request(`/privacy-review/${processingJobId}/approve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};
