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
  interpretationAcknowledgedAt: string | null;
  interpretationAcknowledgedById: string | null;
  interpretationAcknowledgedByName: string | null;
  aiKnowledgeGeneratedAt?: string | null;
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
  interpretationDataType: InterpretationDataType;
  evidenceModality: EvidenceModality;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type InterpretationDataType =
  | "tabular_structured"
  | "text_narrative"
  | "mixed_structured_text"
  | "insufficiently_extracted";

export type EvidenceModality =
  | "structured_quantitative"
  | "structured_qualitative"
  | "mixed_dual_track"
  | "narrative_qualitative"
  | "insufficiently_extracted";

export type PrivacyReviewDecisionValue =
  "keep" | "tokenize" | "generalize" | "remove" | "restrict";

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
  interpretationDataType: InterpretationDataType;
  evidenceModality: EvidenceModality;
  sourceFileName: string | null;
  extension: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;
  tableCount: number;
  paragraphCount: number;
  tables: ParsedRepresentationPreviewTable[];
  paragraphs: ParsedRepresentationPreviewParagraph[];
}

// What this client sends when approving a review. decidedById/decidedAt are
// never sent from here — the backend stamps those itself from the
// authenticated caller. Keeping detected personal data unchanged requires an
// explicit acknowledgement flag in the current privacy-review flow.
export interface PrivacyReviewFieldDecisionInput {
  field: string;
  entityType: string;
  decision: PrivacyReviewDecisionValue;
  reason?: string;
  keepUnchangedAcknowledged?: boolean;
}

// What the backend actually persists and returns — the input plus a real
// audit trail of who decided this finding and when.
export interface PrivacyReviewFieldDecisionRecord extends PrivacyReviewFieldDecisionInput {
  decidedById: string;
  decidedAt: string;
}

export interface PrivacyReviewDecisions {
  fieldDecisions?: PrivacyReviewFieldDecisionRecord[];
}

export interface PrivacyReviewDecisionsInput {
  fieldDecisions?: PrivacyReviewFieldDecisionInput[];
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
  decisions?: PrivacyReviewDecisionsInput;
}

export interface ApprovePrivacyReviewResponse {
  review: PrivacyReviewRecord;
  job: ProcessingJobRecord;
}

export interface AuthResponse {
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

export interface InterpretationEntity {
  id: string;
  originalField: string;
  aiMeaning: string;
  entityType: string;
  confidence: number;
  reason: string;
  sampleValues: string[];
}

export type IndicatorRelevanceStage = "output" | "outcome" | "impact";
export type InterpretationIndicatorStatus = "kept" | "rejected";
export type InterpretationQualitativeStage =
  "output" | "outcome" | "impact" | "context" | "risk";
export type InterpretationQuoteExcerptKind = "direct" | "paraphrased";
export type InterpretationQuoteSpeakerType =
  "participant" | "caregiver" | "staff" | "volunteer" | "evaluator" | "unknown";
export type InterpretationQuotePrivacyMode =
  "verbatim_safe" | "redacted" | "paraphrased_only";
export type InterpretationQualitativeFindingRelation =
  "reinforces" | "contradicts" | "complicates" | "context_only";
export type InterpretationQualitativeFindingCategory =
  | "outcome_support"
  | "outcome_complication"
  | "outcome_contradiction"
  | "barrier"
  | "enabler"
  | "unintended_effect"
  | "context_only";
export type InterpretationQualitativeOutcomeAnchorType =
  | "project_outcome"
  | "project_impact"
  | "activity_objective"
  | "activity_success_indicator"
  | "unanchored";

export interface InterpretationIndicator {
  id: string;
  name: string;
  description: string;
  confidence: number;
  reason: string;
  relatedEntityIds: string[];
  supportingParagraphKeys: string[];
  relevanceStage: IndicatorRelevanceStage | null;
  matchesStatedGoal: boolean;
  status: InterpretationIndicatorStatus;
}

export interface InterpretationRelationship {
  id: string;
  description: string;
  involvedEntityIds: string[];
  confidence: number;
}

export interface InterpretationSupportingQuote {
  id: string;
  excerptText: string;
  excerptKind: InterpretationQuoteExcerptKind;
  speakerType: InterpretationQuoteSpeakerType;
  stage: InterpretationQualitativeStage;
  confidence: number;
  reason: string;
  sourceReference: string;
  privacyMode: InterpretationQuotePrivacyMode;
  status: InterpretationIndicatorStatus;
}

export interface InterpretationQualitativeFinding {
  id: string;
  summary: string;
  stage: InterpretationQualitativeStage;
  confidence: number;
  reason: string;
  relatedEntityIds: string[];
  relatedIndicatorIds: string[];
  supportingQuoteIds: string[];
  category: InterpretationQualitativeFindingCategory;
  outcomeReference: string | null;
  outcomeAnchorType: InterpretationQualitativeOutcomeAnchorType;
  relationToEvidence: InterpretationQualitativeFindingRelation;
  status: InterpretationIndicatorStatus;
}

export type InterpretationQuestionKind =
  "single_choice" | "free_text" | "merge_confirmation";
export type InterpretationQuestionDomain = "preparation" | "interpretation";
export type InterpretationQuestionCode =
  | "normalization_merge"
  | "row_grain"
  | "duplicate_identifier_resolution"
  | "primary_status_field"
  | "positive_status_values"
  | "primary_date_field";
export type InterpretationQuestionStatus = "pending" | "answered";

export interface InterpretationQuestion {
  id: string;
  prompt: string;
  kind: InterpretationQuestionKind;
  questionDomain: InterpretationQuestionDomain;
  options: string[] | null;
  isBlocking: boolean;
  questionCode: InterpretationQuestionCode | null;
  targetTableName: string | null;
  targetColumnName: string | null;
  status: InterpretationQuestionStatus;
  answeredValue: string | null;
  answeredById: string | null;
  answeredAt: string | null;
}

export interface InterpretationWarning {
  id: string;
  message: string;
  severity: "info" | "warning";
}

export type DatasetProfileColumnType =
  | "identifier"
  | "numeric"
  | "date"
  | "categorical"
  | "free_text"
  | "boolean"
  | "unknown";

export interface DatasetProfileValueCount {
  value: string;
  count: number;
}

export interface DatasetProfileNumericSummary {
  min: number;
  max: number;
  mean: number;
}

export interface DatasetProfileDateSummary {
  min: string;
  max: string;
}

export interface DatasetProfileColumn {
  name: string;
  inferredType: DatasetProfileColumnType;
  roleHints: string[];
  nullPercentage: number;
  distinctCount: number;
  averageTextLength: number | null;
  topValues: DatasetProfileValueCount[];
  numericSummary: DatasetProfileNumericSummary | null;
  dateSummary: DatasetProfileDateSummary | null;
  duplicateNonNullValueCount: number;
}

export type DatasetProfileIssueCode =
  | "duplicate_identifier"
  | "missing_identifier"
  | "row_grain_ambiguous"
  | "multiple_date_columns"
  | "multiple_status_columns"
  | "status_values_need_definition";

export interface DatasetProfileIssue {
  code: DatasetProfileIssueCode;
  severity: "info" | "warning";
  tableName: string;
  columnName: string | null;
  message: string;
}

export interface DatasetProfileTable {
  name: string;
  rowCount: number;
  columnCount: number;
  likelyIdentifierColumns: string[];
  likelyStatusColumns: string[];
  likelyStageColumns: string[];
  likelyDateColumns: string[];
  likelyMeasureColumns: string[];
  likelyFreeTextColumns: string[];
  likelySubgroupColumns: string[];
  columns: DatasetProfileColumn[];
}

export interface DatasetProfile {
  tableCount: number;
  paragraphCount: number;
  tables: DatasetProfileTable[];
  issues: DatasetProfileIssue[];
}

export interface InterpretationGoalCoverage {
  id: string;
  goalSummary: string;
  isSupportedByData: boolean;
  relatedIndicatorIds: string[];
  gapExplanation: string | null;
}

export type DatasetPreparationStatus =
  | "not_applicable"
  | "not_started"
  | "awaiting_answers"
  | "ready_for_analysis"
  | "analysis_completed";

export interface DatasetPreparationDecision {
  questionId: string;
  questionCode: InterpretationQuestionCode;
  questionPrompt: string;
  tableName: string | null;
  columnName: string | null;
  answeredValue: string;
  answeredById: string | null;
  answeredAt: string | null;
}

export interface DatasetPreparationDecisionSelection {
  questionId: string;
  tableName: string | null;
  columnName: string | null;
  value: string;
}

export interface DatasetPreparationDecisionSummary {
  normalizationMerges: DatasetPreparationDecisionSelection[];
  rowGrains: DatasetPreparationDecisionSelection[];
  duplicateIdentifierResolutions: DatasetPreparationDecisionSelection[];
  primaryStatusFields: DatasetPreparationDecisionSelection[];
  positiveStatusDefinitions: DatasetPreparationDecisionSelection[];
  primaryDateFields: DatasetPreparationDecisionSelection[];
}

export type PreparedDatasetColumnRole =
  | "identifier"
  | "primary_status"
  | "primary_date"
  | "measure"
  | "subgroup"
  | "free_text"
  | "other";

export type PreparedDatasetIdentifierHandling =
  | "assume_unique"
  | "allow_duplicate_rows_as_events"
  | "deduplicate_by_identifier"
  | "manual_review_required";

export interface PreparedDatasetColumn {
  name: string;
  inferredType: DatasetProfileColumnType | null;
  role: PreparedDatasetColumnRole;
  positiveStatusValues: string[];
  positiveStatusDefinitionText: string | null;
  normalizationAccepted: boolean | null;
}

export interface PreparedDatasetTable {
  name: string;
  rowCount: number;
  columnCount: number;
  selectedRowGrain: string | null;
  identifierColumn: string | null;
  identifierHandling: PreparedDatasetIdentifierHandling | null;
  primaryStatusColumn: string | null;
  primaryDateColumn: string | null;
  columns: PreparedDatasetColumn[];
  notes: string[];
}

export interface PreparedDatasetSnapshot {
  evidenceModality: EvidenceModality;
  isReadyForDeterministicAnalysis: boolean;
  unresolvedRequirements: string[];
  tables: PreparedDatasetTable[];
}

export type DeterministicAnalysisStatus =
  "not_applicable" | "awaiting_preparation" | "ready";

export type DeterministicAnalysisMetricKind =
  "count" | "count_distinct" | "ratio" | "distribution" | "trend";

export interface DeterministicAnalysisMetric {
  metricKey: string;
  label: string;
  description: string;
  tableName: string;
  sourceColumns: string[];
  kind: DeterministicAnalysisMetricKind;
  formula: string;
  value: number | null;
  unit: string | null;
  components: Record<string, unknown>;
}

export interface DeterministicAnalysisDistributionBucket {
  value: string | null;
  count: number;
  ratio: number | null;
}

export interface DeterministicAnalysisDistribution {
  distributionKey: string;
  label: string;
  tableName: string;
  columnName: string;
  buckets: DeterministicAnalysisDistributionBucket[];
}

export interface DeterministicAnalysisTrendPoint {
  period: string;
  rowCount: number;
  positiveCount: number | null;
  positiveRatio: number | null;
}

export interface DeterministicAnalysisTrend {
  trendKey: string;
  label: string;
  tableName: string;
  dateColumnName: string;
  positiveStatusColumnName: string | null;
  points: DeterministicAnalysisTrendPoint[];
}

export interface DeterministicAnalysisSubgroupSegment {
  value: string | null;
  rowCount: number;
  positiveCount: number | null;
  positiveRatio: number | null;
}

export interface DeterministicAnalysisSubgroupBreakdown {
  breakdownKey: string;
  label: string;
  tableName: string;
  columnName: string;
  segments: DeterministicAnalysisSubgroupSegment[];
}

export interface DeterministicAnalysisWarning {
  code: string;
  message: string;
}

export interface DeterministicAnalysisCategoricalCrosstabCell {
  valueA: string | null;
  valueB: string | null;
  count: number;
  ratio: number | null;
}

export interface DeterministicAnalysisCategoricalCrosstab {
  crosstabKey: string;
  label: string;
  tableName: string;
  columnAName: string;
  columnBName: string;
  cells: DeterministicAnalysisCategoricalCrosstabCell[];
}

export interface DeterministicAnalysisNumericCategoryGroup {
  categoryValue: string | null;
  count: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  median: number | null;
  standardDeviation: number | null;
  q1: number | null;
  q3: number | null;
}

export interface DeterministicAnalysisNumericCategorySummary {
  summaryKey: string;
  label: string;
  tableName: string;
  numericColumnName: string;
  categoryColumnName: string;
  groups: DeterministicAnalysisNumericCategoryGroup[];
}

export interface DeterministicAnalysisNumericCorrelation {
  correlationKey: string;
  label: string;
  tableName: string;
  columnAName: string;
  columnBName: string;
  completePairCount: number;
  pearson: number | null;
  spearman: number | null;
}

export interface DeterministicAnalysisCandidateIndicator {
  indicatorKey: string;
  label: string;
  description: string;
  tableName: string;
  formula: string;
  value: number | null;
  unit: string | null;
  sourceColumns: string[];
  groundingNote: string;
}

export interface DeterministicAnalysisRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string;
  privacySafeRepresentationId: string;
  interpretationResultId: string;
  datasetPreparationId: string;
  status: DeterministicAnalysisStatus;
  metrics: DeterministicAnalysisMetric[];
  distributions: DeterministicAnalysisDistribution[];
  trends: DeterministicAnalysisTrend[];
  subgroupBreakdowns: DeterministicAnalysisSubgroupBreakdown[];
  categoricalCrosstabs: DeterministicAnalysisCategoricalCrosstab[];
  numericCategorySummaries: DeterministicAnalysisNumericCategorySummary[];
  numericCorrelations: DeterministicAnalysisNumericCorrelation[];
  warnings: DeterministicAnalysisWarning[];
  candidateIndicators: DeterministicAnalysisCandidateIndicator[];
  createdAt: string;
  updatedAt: string;
}

export interface DatasetPreparationRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string;
  privacySafeRepresentationId: string;
  interpretationResultId: string;
  status: DatasetPreparationStatus;
  blockingQuestionCount: number;
  answeredBlockingQuestionCount: number;
  unansweredBlockingQuestionIds: string[];
  decisions: DatasetPreparationDecision[];
  decisionSummary: DatasetPreparationDecisionSummary;
  preparedDataset: PreparedDatasetSnapshot | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterpretationResultRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string;
  privacySafeRepresentationId: string;
  processingJobId: string;
  versionNumber: number;
  previousInterpretationResultId: string | null;
  datasetType: string;
  overallConfidence: number;
  datasetProfile: DatasetProfile | null;
  entities: InterpretationEntity[];
  indicators: InterpretationIndicator[];
  relationships: InterpretationRelationship[];
  qualitativeFindings: InterpretationQualitativeFinding[];
  supportingQuotes: InterpretationSupportingQuote[];
  questions: InterpretationQuestion[];
  warnings: InterpretationWarning[];
  goalAlignment: InterpretationGoalCoverage[];
  datasetPreparation: DatasetPreparationRecord | null;
  deterministicAnalysis: DeterministicAnalysisRecord | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInterpretationOverview {
  results: InterpretationResultRecord[];
}

export interface StartInterpretationResponse {
  job: ProcessingJobRecord;
}

export interface StartActivityInterpretationResponse {
  jobs: ProcessingJobRecord[];
  startedCount: number;
  skippedCount: number;
}

export type ActivityAiKnowledgeInsightSourceType =
  | "goal_alignment"
  | "qualitative_finding"
  | "indicator"
  | "distribution_signal";

export interface ActivityAiKnowledgeInsight {
  id: string;
  sourceType: ActivityAiKnowledgeInsightSourceType;
  text: string;
  isGoalRelevant: boolean;
  sourceUploadMetadataIds: string[];
}

export interface ActivityAiKnowledgeRecord {
  activityId: string;
  projectId: string;
  activityName: string;
  interpretedEvidenceCount: number;
  totalEvidenceCount: number;
  generatedAt: string | null;
  summaryText: string;
  insights: ActivityAiKnowledgeInsight[];
}

export interface StartInterpretationPayload {
  language: "de" | "en";
}

export interface AnswerInterpretationQuestionPayload {
  answeredValue: string;
}

// ============================================================
// Analytics (Phase 5) — see "Phase 5 — Deterministic Analytics.md".
// Every number below was already computed and merge-recombined by
// Phase 4; nothing in this module (or ia_backend's analytics module)
// computes a value. The LLM only ever selects/ranks/narrates.
// ============================================================

export type AnalyticsScopeType = "PROJECT" | "ACTIVITY";

export interface AnalyticsScope {
  type: AnalyticsScopeType;
  projectId: string;
  activityId: string | null;
}

export type AnalyticsExecutionStatus =
  | "NOT_STARTED"
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "COMPLETED_WITH_WARNINGS"
  | "FAILED"
  | "STALE";

export type KnowledgeIndicatorDeduplicationConfidence =
  "deduplicated" | "not_deduplicated_across_sources" | "not_applicable";

export interface EvidenceCatalogMetricProvenance {
  knowledgeEntityId: string;
  uploadMetadataId: string;
  interpretationResultId: string;
  sourceReference: string;
}

export interface EvidenceCatalogMetricEntry {
  entryId: string;
  entryType: "METRIC";
  label: string;
  description: string;
  value: number;
  unit: string | null;
  deduplicationConfidence: KnowledgeIndicatorDeduplicationConfidence;
  activityId: string;
  provenance: EvidenceCatalogMetricProvenance;
}

export interface EvidenceCatalogThemeEntry {
  entryId: string;
  entryType: "QUALITATIVE_THEME";
  label: string;
  description: string;
  quoteCount: number;
  categories: Array<
    | "outcome_support"
    | "outcome_complication"
    | "outcome_contradiction"
    | "barrier"
    | "enabler"
    | "unintended_effect"
    | "context_only"
  >;
  outcomeReferences: string[];
  outcomeAnchorTypes: Array<
    | "project_outcome"
    | "project_impact"
    | "activity_objective"
    | "activity_success_indicator"
    | "unanchored"
  >;
  sourceActivityIds: string[];
  sourceUploadMetadataIds: string[];
}

export type EvidenceCatalogEntry =
  EvidenceCatalogMetricEntry | EvidenceCatalogThemeEntry;

export interface EvidenceCatalogOmittedEntry {
  knowledgeEntityId: string;
  reason: string;
}

export interface EvidenceCatalogQualitySignal {
  signalId: string;
  sourceType:
    "dataset_preparation" | "deterministic_analysis" | "catalog_assembly";
  interpretationResultId: string;
  activityId: string | null;
  uploadMetadataId: string;
  severity: "info" | "warning";
  message: string;
}

export interface EvidenceCatalog {
  catalogVersion: string;
  knowledgeModelVersion: number;
  scope: AnalyticsScope;
  entries: EvidenceCatalogEntry[];
  omittedEntries: EvidenceCatalogOmittedEntry[];
  qualitySignals: EvidenceCatalogQualitySignal[];
}

export interface DashboardCurationNarrative {
  text: string;
  referencedEntryIds: string[];
}

export interface DashboardCuration {
  featuredEntryIds: string[];
  narrative: DashboardCurationNarrative[];
  groundingStatus: "PASSED" | "FAILED";
  groundingRetryCount: number;
  curatorModelVersion: string;
  fellBackToSelectionOnly: boolean;
}

export interface AnalyticsDashboardGoalLinkage {
  outcomeReferences: string[];
  successIndicators: string[];
  matchedProjectGoalPhrases: string[];
}

export interface AnalyticsDashboardQualityFlag {
  sourceType:
    "dataset_preparation" | "deterministic_analysis" | "catalog_assembly";
  severity: "info" | "warning";
  message: string;
}

export type AnalyticsDashboardWidgetKind =
  | "kpi"
  | "summary"
  | "horizontal_bar"
  | "line_series"
  | "category_rank"
  | "theme_list";

export interface AnalyticsDashboardWidgetBase {
  widgetId: string;
  kind: AnalyticsDashboardWidgetKind;
  title: string;
  subtitle: string | null;
  description: string;
  sourceActivityIds: string[];
  sourceUploadMetadataIds: string[];
  goalLinkage: AnalyticsDashboardGoalLinkage;
  qualityFlags: AnalyticsDashboardQualityFlag[];
}

export interface AnalyticsDashboardKpiWidget extends AnalyticsDashboardWidgetBase {
  kind: "kpi";
  entryId: string;
  label: string;
  description: string;
  value: number;
  unit: string | null;
  deduplicationConfidence: KnowledgeIndicatorDeduplicationConfidence;
}

export interface AnalyticsDashboardSummaryWidget extends AnalyticsDashboardWidgetBase {
  kind: "summary";
  paragraphs: string[];
  referencedEntryIds: string[];
}

export interface AnalyticsDashboardHorizontalBarItem {
  id: string;
  label: string;
  description: string;
  value: number;
  unit: string | null;
  entryId: string | null;
}

export interface AnalyticsDashboardHorizontalBarWidget extends AnalyticsDashboardWidgetBase {
  kind: "horizontal_bar";
  unit: string | null;
  items: AnalyticsDashboardHorizontalBarItem[];
}

export interface AnalyticsDashboardLineSeriesPoint {
  label: string;
  value: number;
}

export interface AnalyticsDashboardLineSeriesWidget extends AnalyticsDashboardWidgetBase {
  kind: "line_series";
  label: string;
  tableName: string;
  activityId: string | null;
  unit: "count" | "ratio";
  points: AnalyticsDashboardLineSeriesPoint[];
}

export interface AnalyticsDashboardCategoryRankItem {
  id: string;
  label: string;
  value: number;
}

export interface AnalyticsDashboardCategoryRankWidget extends AnalyticsDashboardWidgetBase {
  kind: "category_rank";
  label: string;
  tableName: string;
  activityId: string | null;
  unit: "count" | "ratio";
  items: AnalyticsDashboardCategoryRankItem[];
}

export interface AnalyticsDashboardThemeListItem {
  entryId: string;
  label: string;
  description: string;
  quoteCount: number;
  outcomeReference: string | null;
}

export interface AnalyticsDashboardThemeListWidget extends AnalyticsDashboardWidgetBase {
  kind: "theme_list";
  items: AnalyticsDashboardThemeListItem[];
}

export type AnalyticsDashboardWidget =
  | AnalyticsDashboardKpiWidget
  | AnalyticsDashboardSummaryWidget
  | AnalyticsDashboardHorizontalBarWidget
  | AnalyticsDashboardLineSeriesWidget
  | AnalyticsDashboardCategoryRankWidget
  | AnalyticsDashboardThemeListWidget;

export interface AnalyticsDashboardLayoutDefinition {
  orderedWidgetIds: string[];
  hiddenWidgetIds: string[];
}

export interface AnalyticsDashboard {
  schemaVersion: string;
  availableWidgets: AnalyticsDashboardWidget[];
  defaultLayout: AnalyticsDashboardLayoutDefinition;
}

export interface AnalyticsDashboardPreferenceRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  scopeType: AnalyticsScopeType;
  dashboardSchemaVersion: string;
  orderedWidgetIds: string[];
  hiddenWidgetIds: string[];
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsDashboardUsageSummary {
  resultId: string;
  totalEvents: number;
  dashboardViewCount: number;
  widgetHideCount: number;
  widgetShowCount: number;
  layoutReorderCount: number;
  layoutRestoreCount: number;
  lastOccurredAt: string | null;
  lastViewedAt: string | null;
}

export interface UpdateAnalyticsDashboardPreferencePayload {
  dashboardSchemaVersion: string;
  orderedWidgetIds: string[];
  hiddenWidgetIds: string[];
}

export type AnalyticsDashboardCompatibilitySource =
  "generated" | "compatibility_fallback";
export type AnalyticsDashboardInteractionType =
  | "dashboard_viewed"
  | "widget_hidden"
  | "widget_shown"
  | "layout_reordered"
  | "layout_restored";

export interface AnalyticsDashboardInteractionPayload {
  resultId: string;
  interactionType: AnalyticsDashboardInteractionType;
  dashboardSchemaVersion: string;
  dashboardCompatibilitySource: AnalyticsDashboardCompatibilitySource;
  orderedWidgetIds: string[];
  hiddenWidgetIds: string[];
  visibleWidgetIds: string[];
  widgetId: string | null;
}

export interface AnalyticsDashboardExportRequestPayload extends UpdateAnalyticsDashboardPreferencePayload {
  format: "json" | "text";
}

export interface AnalyticsDataQuality {
  recordsExcludedCount: number;
  warnings: string[];
}

export interface AnalyticsExecutionRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  scopeType: AnalyticsScopeType;
  status: AnalyticsExecutionStatus;
  startedAt: string | null;
  completedAt: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsResultRecord {
  id: string;
  analyticsExecutionId: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  scopeType: AnalyticsScopeType;
  catalogVersion: string;
  knowledgeModelVersion: number;
  catalog: EvidenceCatalog;
  curation: DashboardCuration;
  dashboard: AnalyticsDashboard | null;
  dataQuality: AnalyticsDataQuality;
  limitations: string[];
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsQueryResponse {
  execution: AnalyticsExecutionRecord | null;
  result: AnalyticsResultRecord | null;
  layoutPreference: AnalyticsDashboardPreferenceRecord | null;
  dashboardCompatibilitySource: AnalyticsDashboardCompatibilitySource | null;
  dashboardUsageSummary: AnalyticsDashboardUsageSummary | null;
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
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: init?.headers ?? {},
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
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: init?.headers ?? {},
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
  logout(): Promise<{ loggedOut: boolean }> {
    return request("/auth/logout", {
      method: "POST",
    });
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
  startInterpretation(
    uploadMetadataId: string,
    payload: StartInterpretationPayload,
  ): Promise<StartInterpretationResponse> {
    return request(`/evidence/${uploadMetadataId}/interpret`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  startActivityInterpretation(
    activityId: string,
    payload: StartInterpretationPayload,
  ): Promise<StartActivityInterpretationResponse> {
    return request(`/activities/${activityId}/interpret`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  getProjectInterpretations(
    projectId: string,
  ): Promise<ProjectInterpretationOverview> {
    return request(`/projects/${projectId}/interpretation`);
  },
  getActivityAiKnowledge(
    activityId: string,
  ): Promise<ActivityAiKnowledgeRecord> {
    return request(`/activities/${activityId}/ai-knowledge`);
  },
  generateActivityAiKnowledge(
    activityId: string,
  ): Promise<ActivityAiKnowledgeRecord> {
    return request(`/activities/${activityId}/ai-knowledge`, {
      method: "POST",
    });
  },
  getInterpretation(
    interpretationResultId: string,
  ): Promise<InterpretationResultRecord> {
    return request(`/interpretations/${interpretationResultId}`);
  },
  answerInterpretationQuestion(
    interpretationResultId: string,
    questionId: string,
    payload: AnswerInterpretationQuestionPayload,
  ): Promise<InterpretationResultRecord> {
    return request(
      `/interpretations/${interpretationResultId}/questions/${questionId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  },
  acknowledgeInterpretationReview(
    activityId: string,
  ): Promise<ActivitySummary> {
    return request(`/activities/${activityId}/interpretation-acknowledgment`, {
      method: "POST",
    });
  },
  generateProjectAnalytics(
    projectId: string,
  ): Promise<AnalyticsExecutionRecord> {
    return request(`/projects/${projectId}/analytics/generate`, {
      method: "POST",
    });
  },
  getProjectAnalytics(projectId: string): Promise<AnalyticsQueryResponse> {
    return request(`/projects/${projectId}/analytics`);
  },
  updateProjectAnalyticsLayout(
    projectId: string,
    payload: UpdateAnalyticsDashboardPreferencePayload,
  ): Promise<AnalyticsDashboardPreferenceRecord> {
    return request(`/projects/${projectId}/analytics/layout`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  resetProjectAnalyticsLayout(projectId: string): Promise<{ success: true }> {
    return request(`/projects/${projectId}/analytics/layout`, {
      method: "DELETE",
    });
  },
  trackProjectAnalyticsInteraction(
    projectId: string,
    payload: AnalyticsDashboardInteractionPayload,
  ): Promise<{ success: true }> {
    return request(`/projects/${projectId}/analytics/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  downloadProjectAnalyticsExport(
    projectId: string,
    payload: AnalyticsDashboardExportRequestPayload,
  ): Promise<Blob> {
    return requestBlob(`/projects/${projectId}/analytics/export`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  generateActivityAnalytics(
    projectId: string,
    activityId: string,
  ): Promise<AnalyticsExecutionRecord> {
    return request(
      `/projects/${projectId}/activities/${activityId}/analytics/generate`,
      { method: "POST" },
    );
  },
  getActivityAnalytics(
    projectId: string,
    activityId: string,
  ): Promise<AnalyticsQueryResponse> {
    return request(`/projects/${projectId}/activities/${activityId}/analytics`);
  },
  updateActivityAnalyticsLayout(
    projectId: string,
    activityId: string,
    payload: UpdateAnalyticsDashboardPreferencePayload,
  ): Promise<AnalyticsDashboardPreferenceRecord> {
    return request(
      `/projects/${projectId}/activities/${activityId}/analytics/layout`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  },
  resetActivityAnalyticsLayout(
    projectId: string,
    activityId: string,
  ): Promise<{ success: true }> {
    return request(
      `/projects/${projectId}/activities/${activityId}/analytics/layout`,
      {
        method: "DELETE",
      },
    );
  },
  trackActivityAnalyticsInteraction(
    projectId: string,
    activityId: string,
    payload: AnalyticsDashboardInteractionPayload,
  ): Promise<{ success: true }> {
    return request(
      `/projects/${projectId}/activities/${activityId}/analytics/events`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  },
  downloadActivityAnalyticsExport(
    projectId: string,
    activityId: string,
    payload: AnalyticsDashboardExportRequestPayload,
  ): Promise<Blob> {
    return requestBlob(
      `/projects/${projectId}/activities/${activityId}/analytics/export`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  },
};
