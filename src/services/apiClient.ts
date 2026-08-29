import i18n from "@/lib/i18n";

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
export type ActivitySystemType = "outcome_evidence";
export type OutcomeTerm = "short" | "long";

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
  canManageLifecycle: boolean;
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
  initialSituation: string | null;
  startMonth: string | null;
  endMonth: string | null;
  fundingProgram: string | null;
  fundingOrganization: string | null;
  targetGroups: string[];
  overarchingTargetGroup: string | null;
  intendedChanges: string[];
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
  systemType: ActivitySystemType | null;
  name: string;
  description: string | null;
  activityType: string | null;
  startDate: string | null;
  endDate: string | null;
  targetAudience: string | null;
  objectives: string | null;
  // Serialized as newline-delimited text in API responses; the activity
  // dialog expands this into one editable row per output goal.
  output: string | null;
  status: ActivityStatus;
  permissions: ActivityPermissions;
  interpretationAcknowledgedAt: string | null;
  interpretationAcknowledgedById: string | null;
  interpretationAcknowledgedByName: string | null;
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
  initialSituation?: string;
  startMonth: string;
  endMonth: string;
  fundingProgram?: string;
  fundingOrganization?: string;
  targetGroups: string[];
  intendedChanges: string[];
  areaOfOperation?: string;
  partnerships?: string;
  sdgs?: string[];
}

export interface UpdateProjectPayload {
  name?: string;
  initialSituation?: string | null;
  startMonth?: string | null;
  endMonth?: string | null;
  fundingProgram?: string | null;
  fundingOrganization?: string | null;
  targetGroups?: string[];
  intendedChanges?: string[];
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
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  objectives?: string;
  output?: string[];
  status?: ActivityStatus;
}

export interface UpdateActivityPayload {
  name?: string;
  description?: string | null;
  activityType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  targetAudience?: string | null;
  objectives?: string | null;
  output?: string[] | null;
  status?: ActivityStatus;
}

export interface WorkspaceActivity extends ActivitySummary {
  uploadMetadataCount: number;
  processingJobCount: number;
}

export interface ProjectOutcomeStatement {
  id: string;
  projectId: string;
  organizationId: string;
  term: OutcomeTerm;
  statement: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutcomeStatementPayload {
  term: OutcomeTerm;
  statement: string;
}

export interface UpdateOutcomeStatementPayload {
  term?: OutcomeTerm;
  statement?: string;
}

export interface DeleteOutcomeStatementResponse {
  id: string;
  projectId: string;
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
  sourceWorkbookUploadMetadataId: string | null;
  derivedSheetName: string | null;
  derivedSheetIndex: number | null;
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
    | "workbook_split"
    | "evidence_processing"
    | "dataset_interpretation"
    | "dataset_review"
    | "metrics_generation"
    | "dashboard_generation"
    | "insight_generation"
    | "report_generation"
    | "chat"
    | "other"
    | "activity_analysis_v2"
    | "qualitative_coding_review";
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
export type EpistemicRole =
  | "identifier"
  | "temporal"
  | "validated_scale"
  | "metric_count"
  | "subjective_code"
  | "free_text"
  | "flag"
  | "categorical"
  | "constant";

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

export interface QualitativeCodingReviewSuggestedCode {
  code: string;
  label: string;
  description: string;
  exampleExcerpts: string[];
}

export interface QualitativeCodingReviewProposedAssignment {
  rowIndex: number;
  assignedCode: string | null;
}

export interface QualitativeCodingReviewFindingRecord {
  findingKey: string;
  tableName: string;
  textColumnName: string;
  syntheticCodeColumnName: string;
  rowCount: number;
  nonEmptyRowCount: number;
  sampleExcerpts: string[];
  existingCodeColumnNames: string[];
  proposedCodes: QualitativeCodingReviewSuggestedCode[];
  proposedAssignments: QualitativeCodingReviewProposedAssignment[];
  sourceCodebookUploadMetadataId: string | null;
  sourceCodebookOriginalFileName: string | null;
}

export interface QualitativeCodingReviewColumnDecisionInput {
  findingKey: string;
  decision: "approve_as_proposed" | "reject_for_now";
  note?: string;
}

export interface QualitativeCodingReviewColumnDecisionRecord extends QualitativeCodingReviewColumnDecisionInput {
  decidedById: string;
  decidedAt: string;
}

export interface QualitativeCodingReviewDecisions {
  columnDecisions?: QualitativeCodingReviewColumnDecisionRecord[];
}

export interface QualitativeCodingReviewDecisionsInput {
  columnDecisions?: QualitativeCodingReviewColumnDecisionInput[];
}

export interface QualitativeCodingReviewRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string | null;
  uploadMetadataId: string;
  privacySafeRepresentationId: string;
  interpretationResultId: string;
  status: "pending" | "approved" | "rejected";
  findings: Record<string, unknown>;
  decisions: QualitativeCodingReviewDecisions | null;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateQualitativeCodingReviewResponse {
  review: QualitativeCodingReviewRecord;
}

export interface ApproveQualitativeCodingReviewPayload {
  decisions?: QualitativeCodingReviewDecisionsInput;
}

export interface ApproveQualitativeCodingReviewResponse {
  review: QualitativeCodingReviewRecord;
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
  | "activity_output"
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
  | "primary_date_field"
  | "epistemic_role_clarification"
  | "cohort_tag";
export type InterpretationQuestionStatus = "pending" | "answered";

// Identifies one column targeted by a grouped instrument (e.g. the baseline
// and endline columns behind one validated survey scale) — see
// InterpretationQuestion.preparationGroupColumns.
export interface InterpretationQuestionTargetColumnRef {
  tableName: string;
  columnName: string;
}

export interface ClarificationQuestionOption {
  value: string;
  label: string;
}

export interface InterpretationQuestion {
  id: string;
  goalId?: string | null;
  kind: InterpretationQuestionKind;
  questionDomain: InterpretationQuestionDomain;
  // The single backend-rendered source of truth for question wording (see
  // CLARIFICATION_QUESTION_WORDING_PLAN.md).
  userFacingPrompt: string;
  userFacingOptions: ClarificationQuestionOption[] | null;
  recommendedOption: string | null;
  recommendedConfidence: number | null;
  isBlocking: boolean;
  questionCode: InterpretationQuestionCode | null;
  targetTableName: string | null;
  targetColumnName: string | null;
  status: InterpretationQuestionStatus;
  answeredValue: string | null;
  answeredById: string | null;
  answeredAt: string | null;
  // Always null now: this grouped questions belonging to the same
  // instrument's baseline/endline pair, but the two question codes that used
  // it (validated_scale_confirmation, declared_scale_bounds) were removed in
  // the outcome-evidence merge (see OUTCOME_EVIDENCE_MERGE_PLAN.md Phase 6).
  preparationGroupId: string | null;
  preparationGroupColumns: InterpretationQuestionTargetColumnRef[] | null;
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
  epistemicRole: EpistemicRole | null;
  isValidatedScaleCandidate: boolean;
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

export type PreparedDatasetMetricKind =
  "count" | "ratio" | "amount" | "duration" | "score" | "flag";

export type PreparedDatasetValueScope =
  "row" | "entity" | "table_aggregate" | "goal_support";

export interface PreparedDatasetColumn {
  name: string;
  inferredType: DatasetProfileColumnType | null;
  role: PreparedDatasetColumnRole;
  positiveStatusValues: string[];
  positiveStatusDefinitionText: string | null;
  normalizationAccepted: boolean | null;
  epistemicRole: EpistemicRole | null;
  metricKind?: PreparedDatasetMetricKind | null;
  valueScope?: PreparedDatasetValueScope | null;
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

export type ActivityAnalysisRunV2Status =
  "collected" | "running" | "needs_clarification" | "completed" | "failed";

export type ActivityAnalysisRunV2ValidationStatus =
  "not_run" | "passed" | "failed";

export type ActivityAnalysisV2GoalAssessmentStatus =
  | "achieved"
  | "not_achieved"
  | "evidence_compiled"
  | "qualitative_evidence_only"
  | "mixed_evidence"
  | "requires_clarification"
  | "requires_capability";

export interface ActivityAnalysisV2MissingCapability {
  kind: "deterministic_calculation";
  name: string;
  reason: string;
}

export interface ActivityAnalysisV2ToolCallRecord {
  toolCallId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  calculationIds: string[];
  qualitativeFindingIds?: string[];
  status: "succeeded" | "failed";
  errorMessage: string | null;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface ActivityAnalysisV2CalculationRecord {
  calculationId: string;
  toolName: string;
  label: string;
  description: string;
  formula: string | null;
  value: number | string | boolean | null;
  unit: string | null;
  sourceUploadMetadataIds: string[];
  sourceTableNames: string[];
  sourceColumns: string[];
  sourceColumnEpistemicRoles?: Array<{
    columnName: string;
    epistemicRole: EpistemicRole | null;
  }>;
  grain?: string;
  numerator?: number | null;
  denominator?: number | null;
  denominatorType?: string;
  identifierColumn?: string | null;
  result: Record<string, unknown>;
}

export interface ActivityAnalysisV2QualitativeFindingRecord {
  findingId: string;
  toolName: string;
  label: string;
  description: string;
  themeOrCode: string | null;
  excerpts: Array<{
    sourceRowId: string | null;
    verbatimText: string;
    sourceColumn: string;
  }>;
  totalMatchingRows: number;
  excerptsReturned: number;
  frequency: {
    count: number;
    denominator: number | null;
    denominatorType: string | null;
  } | null;
  codingMethod: "source_provided" | "llm_assisted_reviewed";
  reliabilitySignal: {
    missingValuePct: number | null;
    raterCount: number | "unknown" | null;
  };
  sourceUploadMetadataIds: string[];
  sourceTableNames: string[];
  sourceColumns: string[];
  sourceColumnEpistemicRoles?: Array<{
    columnName: string;
    epistemicRole: EpistemicRole | null;
  }>;
  identifierColumn: string | null;
}

export interface ActivityAnalysisV2GoalAssessmentRecord {
  goalId: string;
  goalType: "output";
  goalText: string;
  evaluationMode:
    "numeric_target" | "condition" | "directional_change" | "evidence_only";
  plannerStatus: "planned" | "requires_clarification" | "requires_capability";
  assessmentStatus: ActivityAnalysisV2GoalAssessmentStatus;
  rationale: string;
  findingText: string;
  missingCapabilities: ActivityAnalysisV2MissingCapability[];
  supportingCalculationIds: string[];
  supportingQualitativeFindingIds: string[];
  evidenceTensionFlag: boolean;
  measuredValue: number | null;
  targetValue: number | null;
  valueFormat?: "number" | "percent" | null;
  comparison: "at_least" | "at_most" | "equal" | null;
  achieved: boolean | null;
}

export interface ActivityAssessmentV2 {
  goalAssessments: ActivityAnalysisV2GoalAssessmentRecord[];
  limitations: string[];
}

export interface ActivityAnalysisV2Diagnostics {
  goalCount: number;
  outputGoalCount: number;
  evidenceCount: number;
  plannedToolRequestCount: number;
  executedToolCallCount: number;
  calculationCount: number;
  validationIssueCount: number;
  goalStatusCounts: {
    achieved: number;
    notAchieved: number;
    evidenceCompiled: number;
    qualitativeEvidenceOnly: number;
    mixedEvidence: number;
    requiresClarification: number;
    requiresCapability: number;
  };
}

export interface ActivityAnalysisRunV2Record {
  analysisRunId: string;
  activityId: string;
  projectId: string;
  activityName: string;
  phase: string;
  status: ActivityAnalysisRunV2Status;
  goalsSnapshot: {
    activityType: string | null;
    objectives: string | null;
    output: string | null;
  };
  evidence: Array<{
    uploadMetadataId: string;
    privacySafeRepresentationId: string;
    logicalEvidenceId: string;
    versionNumber: number;
    originalFileName: string;
    evidenceModality: string | null;
    uploadedAt: string;
  }>;
  runLimits: {
    maxToolCalls: number;
    maxLlmIterations: number;
    timeoutMs: number;
    maxEvidenceItems: number;
  };
  clarificationQuestions: InterpretationQuestion[];
  toolCallTrace: ActivityAnalysisV2ToolCallRecord[];
  calculations: ActivityAnalysisV2CalculationRecord[];
  qualitativeFindings: ActivityAnalysisV2QualitativeFindingRecord[];
  assessment: ActivityAssessmentV2 | null;
  diagnostics: ActivityAnalysisV2Diagnostics;
  validation: {
    status: ActivityAnalysisRunV2ValidationStatus;
    issues: string[];
  };
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// Project-level "impact story" dashboard — a read model over already-
// grounded indicator values, grouped per activity with no cross-activity
// summation. Deliberately a separate type family from
// AnalyticsDashboardWidgetKind (the legacy "Analysen" dashboard's widget
// vocabulary) to keep this surface decoupled from that inert code.
export type ImpactIndicatorTileFormat = "number" | "percentage";

export interface ImpactStoryKpiTile {
  kind: "kpi";
  indicatorId: string;
  label: string;
  description: string;
  value: number | null;
  formatAs: ImpactIndicatorTileFormat;
}

export interface ImpactStoryCategoryRankTile {
  kind: "category_rank";
  indicatorId: string;
  label: string;
  description: string;
  buckets: Array<{ category: string; count: number }>;
}

export interface ImpactStoryTrendPoint {
  period: string;
  count: number | null;
  numeratorCount: number | null;
  denominatorCount: number | null;
}

export interface ImpactStoryTrendTile {
  kind: "line_series";
  indicatorId: string;
  label: string;
  description: string;
  points: ImpactStoryTrendPoint[];
}

export type ImpactIndicatorTile =
  ImpactStoryKpiTile | ImpactStoryCategoryRankTile | ImpactStoryTrendTile;

export interface ActivityImpactStoryCard {
  activityId: string;
  activityName: string;
  tiles: ImpactIndicatorTile[];
}

export interface ProjectImpactStorySourceSnapshotItem {
  activityId: string;
  activityAnalysisRunId: string;
}

export type ProjectChartOpportunityKind =
  | "context_distribution"
  | "calculation"
  | "goal_assessment"
  | "paired_story_delta";

export type ProjectChartOpportunityStatus =
  "ready_now" | "blocked_by_extraction" | "blocked_by_missing_data";

// One row of the deterministic chart-opportunity audit: every chart-worthy
// fact the project's current analysis runs could support, classified into
// whether it's already materialized, blocked by a pipeline gap, or blocked
// by missing/insufficient evidence. Read-only diagnostics, computed once
// per generation run — never editable from this page.
export interface ProjectChartOpportunityAuditEntry {
  entryId: string;
  kind: ProjectChartOpportunityKind;
  activityId: string;
  activityName: string;
  title: string;
  sourceTables: string[];
  status: ProjectChartOpportunityStatus;
  reasonCode: string;
  reasonDetail: string;
}

// Diff between the opportunity audit's ready_now set and what the chart
// planner actually selected — answers "X was available, why didn't it show
// up?", which the opportunity audit alone cannot.
export interface ProjectChartSelectionAudit {
  selectedEntryIds: string[];
  unselectedReadyEntryIds: string[];
  highSignalUnselectedEntryIds: string[];
  selectionWarnings: string[];
}

export interface ProjectImpactStoryDiagnostics {
  activityCount: number;
  indicatorCount: number;
  excludedIndicatorCount: number;
  activitiesWithNoGroundedIndicators: string[];
  chartOpportunityAudit?: ProjectChartOpportunityAuditEntry[];
  chartSelectionAudit?: ProjectChartSelectionAudit;
}

export type ProjectImpactStoryStatus = "completed" | "failed";

// A goal-verdict traffic light, recomputed from measuredValue/targetValue
// against fixed thresholds every time — never read from an evidence-embedded
// "target met" flag. See IMPACT_STORY_OUTCOME_EXTENSION_PLAN.md §3.3.
export type ProjectImpactStoryGoalStatus = "good" | "warn" | "risk";

// Project-level headline KPIs and chart plan — the LLM-planned,
// backend-executed story layer on top of activityCards. Every `value`/`data`
// field is computed entirely by ia_backend from real V2 calculations; see
// projectImpactStoryChartPlanExecution.ts on the backend.
export interface ProjectImpactStoryHeadlineKpi {
  kpiId: string;
  label: string;
  value: number;
  formatAs: ImpactIndicatorTileFormat;
  narrativeReason: string;
  // Present only for a KPI built from a single goal_assessment with a
  // resolved measuredValue/targetValue — a plain fact-count KPI (e.g.
  // "Jugendliche im Programm") carries neither field.
  status?: ProjectImpactStoryGoalStatus;
  statusCallout?: string;
}

// A pure descriptive distribution over a categorical evidence column with no
// goal or outcome link (e.g. a district breakdown) — computed
// deterministically and kept structurally separate from outcome-linked
// claims. The chart planner may still choose it as story-supporting
// evidence; this shape remains for fallback-only descriptive charts.
export interface ContextCatalogEntry {
  entryId: string;
  activityId: string;
  activityName: string;
  labelDe: string;
  dimensionLabelDe: string;
  shares: Array<{ labelDe: string; count: number }>;
  n: number;
  eligibleChartTypes: Array<"hbar_target" | "donut_share">;
  sourceDe: string;
}

// Every goal_assessment with a resolved measuredValue/targetValue,
// expressed as one ranked-progress entry — computed deterministically by
// ia_backend and always present when non-empty, never subject to
// chart-plan selection. See projectImpactStoryGoalProgressChart.tsx.
export interface ProjectImpactStoryGoalProgressEntry {
  entryId: string;
  label: string;
  activityName: string;
  progressPercent: number;
  status: ProjectImpactStoryGoalStatus;
}

export type ProjectImpactStoryChartType =
  "bar" | "pie" | "line" | "comparison" | "distribution";

export interface ProjectImpactStoryChartDatum {
  label: string;
  value: number;
}

// What each datum's `label` means, set deterministically by the backend —
// never inferred from the label text. "status" labels are
// ActivityAnalysisV2GoalAssessmentStatus values and get the reserved status
// palette + a legend, since each segment is a distinct identity a viewer
// needs to recognize; the other three kinds repeat the same measure across
// categories/periods/activities and stay single-hue.
export type ProjectImpactStoryChartDataKind =
  "category" | "period" | "status" | "activity";

export interface ProjectImpactStoryChartSpec {
  chartId: string;
  chartType: ProjectImpactStoryChartType;
  dataKind: ProjectImpactStoryChartDataKind;
  valueFormat: ImpactIndicatorTileFormat;
  title: string;
  subtitle: string | null;
  narrativeReason: string;
  data: ProjectImpactStoryChartDatum[];
  // True only for a before/after pair detected from declared pairing
  // metadata but never human-confirmed as outcome evidence — must render
  // visually distinct from a confirmed impactCatalog chart (same shape,
  // different evidentiary weight). Omitted (not false) on every other
  // chart.
  isExploratory?: boolean;
}

export interface ImpactCatalogEntry {
  entryId: string;
  shape: "paired_delta";
  outcomeId: string;
  outcomeTerm: OutcomeTerm;
  outcomeStatement: string;
  pairLabelDe: string;
  beforeValue: number;
  afterValue: number;
  nMatched: number;
  nBaseline: number;
  sourceDe: string;
}

export interface OutcomeDistributionEntry {
  entryId: string;
  shape: "single_distribution";
  outcomeId: string;
  outcomeTerm: OutcomeTerm;
  outcomeStatement: string;
  questionLabelDe: string;
  shares: Array<{ labelDe: string; count: number }>;
  n: number;
  sourceDe: string;
}

export interface UnmeasuredOutcomeEntry {
  entryId: string;
  shape: "unmeasured";
  outcomeId: string;
  outcomeTerm: OutcomeTerm;
  outcomeStatement: string;
}

export type ImpactCatalogItem =
  ImpactCatalogEntry | OutcomeDistributionEntry | UnmeasuredOutcomeEntry;

export type ProjectImpactStoryNarrativeStatus =
  | "generated"
  // Real AI-written narrative, but a detail in it couldn't be
  // automatically confirmed against the project's data — distinct from
  // "deterministic_fallback", which is templated text, not AI prose.
  | "generated_unverified"
  | "deterministic_fallback"
  | "call_failed";

export interface ProjectImpactStoryRecord {
  id: string;
  organizationId: string;
  projectId: string;
  status: ProjectImpactStoryStatus;
  sourceSnapshot: ProjectImpactStorySourceSnapshotItem[];
  activityCards: ActivityImpactStoryCard[];
  headlineKpis: ProjectImpactStoryHeadlineKpi[];
  chartPlan: ProjectImpactStoryChartSpec[];
  // Deterministic, no-LLM charts for every ready catalog entry the chart
  // plan didn't select this run — the backlog panel lets a viewer add any
  // of these to the dashboard instantly.
  backlogChartPlan: ProjectImpactStoryChartSpec[];
  // Fallback-only descriptive charts when the planner produced no selected
  // story charts.
  contextCharts: ContextCatalogEntry[];
  impactCatalog: ImpactCatalogItem[];
  goalProgressEntries: ProjectImpactStoryGoalProgressEntry[];
  narrativeSummary: string | null;
  narrativeStatus: ProjectImpactStoryNarrativeStatus | null;
  diagnostics: ProjectImpactStoryDiagnostics;
  llmUsage: Record<string, unknown> | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImpactStoryReadResult {
  story: ProjectImpactStoryRecord | null;
  isStale: boolean;
}

export type ActivityEvidenceLinkageStatus = "needs_review" | "resolved";

export interface ActivityEvidenceLinkageProposalRecord {
  proposalId: string;
  uploadMetadataIdA: string;
  uploadMetadataIdB: string;
  tableNameA: string;
  tableNameB: string;
  columnNameA: string;
  columnNameB: string;
  matchBasis: "identifier_column" | "name_like_column";
  confidence: "high" | "medium";
  overlapRatio: number;
}

export interface ActivityEvidenceLinkageProposalDecisionRecord {
  proposalId: string;
  decision: "accept" | "reject";
  decidedAt: string;
}

export interface ActivityEvidenceLinkageResultRecord {
  id: string;
  organizationId: string;
  projectId: string;
  activityId: string;
  status: ActivityEvidenceLinkageStatus;
  groups: Array<{
    joinKeyLabel: string;
    linkedUploadMetadataIds: string[];
  }>;
  proposals: ActivityEvidenceLinkageProposalRecord[];
  proposalDecisions: ActivityEvidenceLinkageProposalDecisionRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface OutcomeEvidenceLinkPairedDelta {
  linkId: string;
  outcomeId: string;
  shape: "paired_delta";
  activityIdBefore: string;
  activityIdAfter: string;
  beforeUploadMetadataId: string;
  beforeTableName: string;
  beforeColumnName: string;
  afterUploadMetadataId: string;
  afterTableName: string;
  afterColumnName: string;
  matchKey: string;
  pairingGroupKey: string;
  confirmedById: string;
  confirmedAt: string;
}

export interface OutcomeEvidenceLinkSingleDistribution {
  linkId: string;
  outcomeId: string;
  shape: "single_distribution";
  activityId: string;
  uploadMetadataId: string;
  tableName: string;
  categoryColumnName: string;
  confirmedById: string;
  confirmedAt: string;
}

export type OutcomeEvidenceLink =
  OutcomeEvidenceLinkPairedDelta | OutcomeEvidenceLinkSingleDistribution;

// New joint pairing+outcome recommendation flow, scoped to one merged
// "Ausgangslage & Wirkungsdaten" activity — see
// OUTCOME_EVIDENCE_MERGE_PLAN.md §4.3/§4.4. Replaces
// OutcomeEvidencePairingProposal for that activity: unlike a proposal
// (deterministically detected from a human-declared pairing tag), a
// recommendation is an LLM suggestion for both which columns pair up *and*
// which outcome they support, always re-validated against real evidence at
// approval time. There is no server-side cache of these yet (§8), so a
// recommendation is only ever recomputed live and echoed back verbatim to
// approve it.
export interface OutcomeEvidenceRecommendationColumnReference {
  uploadMetadataId: string;
  tableName: string;
  columnName: string;
  label: string;
  cohortTag: string | null;
}

export type OutcomeEvidenceRecommendation =
  | {
      shape: "paired_delta";
      before: OutcomeEvidenceRecommendationColumnReference;
      after: OutcomeEvidenceRecommendationColumnReference;
      outcomeId: string | null;
      rationale: string;
    }
  | {
      shape: "single_distribution";
      column: OutcomeEvidenceRecommendationColumnReference;
      outcomeId: string | null;
      rationale: string;
    };

// Read-side counterpart to OutcomeEvidenceRecommendation for an already
// *confirmed* OutcomeEvidenceLink — same before/after/column shape (so the
// panel can reuse its recommendation grouping/rendering logic for both),
// but with linkId/confirmedAt instead of a rationale. Backed by a real
// GET route, unlike recommendations: this is what makes the confirmed-links
// summary survive a tab switch or page refresh.
export type OutcomeEvidenceConfirmedLink =
  | {
      linkId: string;
      shape: "paired_delta";
      before: OutcomeEvidenceRecommendationColumnReference;
      after: OutcomeEvidenceRecommendationColumnReference;
      outcomeId: string;
      confirmedAt: string;
    }
  | {
      linkId: string;
      shape: "single_distribution";
      column: OutcomeEvidenceRecommendationColumnReference;
      outcomeId: string;
      confirmedAt: string;
    };

// The raw candidate catalog the recommend call is built from, with no LLM
// call involved — powers the "manually add a pairing" picker for cases the
// model missed.
export interface OutcomeEvidenceCandidate {
  columnId: string;
  uploadMetadataId: string;
  tableName: string;
  columnName: string;
  label: string;
  epistemicRole: string | null;
  inferredType: string | null;
  distinctValueCount: number | null;
  identifierColumn: string | null;
  cohortTag: string | null;
}

export type ActivityWorkflowStage =
  | "no_evidence"
  | "privacy_review"
  | "analysis_pending"
  | "analysis_running"
  | "needs_clarification"
  | "qualitative_review"
  | "goal_review"
  | "assessment_ready"
  | "reviewed";

export interface ActivityWorkflowStageRecord {
  activityId: string;
  stage: ActivityWorkflowStage;
}

export interface StartInterpretationPayload {
  language: "de" | "en";
}

export interface AnswerInterpretationQuestionsPayload {
  answers: Array<{ questionId: string; answeredValue: string }>;
}

export interface AnswerActivityAnalysisV2QuestionsPayload {
  answers: Array<{ questionId: string; answeredValue: string }>;
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
    | "activity_output"
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

function resolveRequestLanguageHeader() {
  const language = (i18n.resolvedLanguage ?? i18n.language)
    .toLowerCase()
    .slice(0, 2);
  return language === "en" ? "en" : "de";
}

function withLanguageHeader(headers: RequestInit["headers"] | undefined) {
  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has("accept-language")) {
    nextHeaders.set("accept-language", resolveRequestLanguageHeader());
  }
  return nextHeaders;
}

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
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: withLanguageHeader(init?.headers),
    });
  } catch {
    // A network-level failure (offline, DNS, CORS, unreachable backend)
    // throws a raw TypeError from fetch — normalize it to ApiError so every
    // caller's `error instanceof ApiError` check still holds.
    throw new ApiError("Network request failed.", 0, "network_error");
  }

  const text = await response.text();
  let payload: ApiEnvelope<T> | ApiFailureEnvelope | undefined;
  try {
    payload = text
      ? (JSON.parse(text) as ApiEnvelope<T> | ApiFailureEnvelope)
      : undefined;
  } catch {
    // A non-JSON body (proxy error page, truncated response, infra-level
    // failure) must still surface as an ApiError — otherwise the raw
    // SyntaxError bypasses every caller's `error instanceof ApiError`
    // check and callers fall back to a generic, undiagnosable message.
    throw new ApiError("Request failed.", response.status);
  }

  if (!response.ok) {
    if (
      payload &&
      typeof payload === "object" &&
      "success" in payload &&
      payload.success === false &&
      payload.error &&
      typeof payload.error === "object" &&
      typeof payload.error.message === "string"
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
  listOutcomeStatements(projectId: string): Promise<ProjectOutcomeStatement[]> {
    return request(`/projects/${projectId}/outcome-statements`);
  },
  createOutcomeStatement(
    projectId: string,
    payload: CreateOutcomeStatementPayload,
  ): Promise<ProjectOutcomeStatement> {
    return request(`/projects/${projectId}/outcome-statements`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  updateOutcomeStatement(
    projectId: string,
    outcomeStatementId: string,
    payload: UpdateOutcomeStatementPayload,
  ): Promise<ProjectOutcomeStatement> {
    return request(
      `/projects/${projectId}/outcome-statements/${outcomeStatementId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  },
  deleteOutcomeStatement(
    projectId: string,
    outcomeStatementId: string,
  ): Promise<DeleteOutcomeStatementResponse> {
    return request(
      `/projects/${projectId}/outcome-statements/${outcomeStatementId}`,
      {
        method: "DELETE",
      },
    );
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
  syncJob(jobId: string): Promise<ProcessingJobRecord> {
    return request(`/jobs/${jobId}/sync`, {
      method: "POST",
    });
  },
  cancelJob(jobId: string): Promise<ProcessingJobRecord> {
    return request(`/jobs/${jobId}/cancel`, {
      method: "POST",
    });
  },
  getPrivacyReview(processingJobId: string): Promise<PrivacyReviewRecord> {
    return request(`/privacy-review/${processingJobId}`);
  },
  getQualitativeCodingReview(
    uploadMetadataId: string,
  ): Promise<QualitativeCodingReviewRecord> {
    return request(`/qualitative-coding-review/${uploadMetadataId}`);
  },
  // Creates a qualitative_coding_review processing job instead of returning
  // the proposal directly — the actual LLM-round-trip generation now runs
  // in activityAnalysisWorker.ts (ia_backend). Poll the returned job with
  // useJobQuery, then re-fetch getQualitativeCodingReview once it's terminal.
  generateQualitativeCodingReview(
    uploadMetadataId: string,
  ): Promise<ProcessingJobRecord> {
    return request(`/qualitative-coding-review/${uploadMetadataId}/generate`, {
      method: "POST",
    });
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
  approveQualitativeCodingReview(
    uploadMetadataId: string,
    payload: ApproveQualitativeCodingReviewPayload,
  ): Promise<ApproveQualitativeCodingReviewResponse> {
    return request(`/qualitative-coding-review/${uploadMetadataId}/approve`, {
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
  getActivityWorkflowStage(
    activityId: string,
  ): Promise<ActivityWorkflowStageRecord> {
    return request(`/activities/${activityId}/workflow-stage`);
  },
  getActivityLinkageReview(
    activityId: string,
  ): Promise<ActivityEvidenceLinkageResultRecord | null> {
    return request(`/activities/${activityId}/linkage-review`);
  },
  reviewActivityLinkageProposal(
    activityId: string,
    proposalId: string,
    payload: { decision: "accept" | "reject" },
  ): Promise<ActivityEvidenceLinkageResultRecord> {
    // proposalId travels in the body, not the URL: it's a synthesized
    // composite key with no fixed length cap and can exceed Fastify's
    // default per-path-param length limit if it were a route param.
    return request(`/activities/${activityId}/linkage-review/decisions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ proposalId, ...payload }),
    });
  },
  // Un-confirming a link is independent of which review flow produced it —
  // same route the old, now-removed outcome-evidence-pairing flow used.
  // Kept even though no current UI action calls it yet (Phase 4 didn't
  // build a "remove confirmed link" action) — the backend capability is
  // real and intentionally preserved, see
  // OUTCOME_EVIDENCE_MERGE_PLAN.md Phase 6.
  removeOutcomeEvidenceLink(
    projectId: string,
    linkId: string,
  ): Promise<{ removed: boolean }> {
    return request(`/projects/${projectId}/outcome-evidence-links/${linkId}`, {
      method: "DELETE",
    });
  },
  // Triggers a real LLM call every time (no reconciliation cache exists yet
  // — see OUTCOME_EVIDENCE_MERGE_PLAN.md §8) — this is a mutation, not a
  // passive read.
  recommendOutcomeEvidencePairings(
    projectId: string,
    activityId: string,
  ): Promise<{ recommendations: OutcomeEvidenceRecommendation[] }> {
    return request(
      `/projects/${projectId}/activities/${activityId}/outcome-evidence-recommendations`,
      { method: "POST" },
    );
  },
  approveOutcomeEvidenceRecommendation(
    projectId: string,
    activityId: string,
    recommendation: OutcomeEvidenceRecommendation,
  ): Promise<OutcomeEvidenceLink> {
    return request(
      `/projects/${projectId}/activities/${activityId}/outcome-evidence-recommendations/approve`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(recommendation),
      },
    );
  },
  // Cheap DB read (no LLM call) — the persistent counterpart to
  // recommendOutcomeEvidencePairings above, backing the confirmed-links
  // summary that survives a tab switch or refresh.
  listOutcomeEvidenceConfirmedLinks(
    projectId: string,
    activityId: string,
  ): Promise<{ links: OutcomeEvidenceConfirmedLink[] }> {
    return request(
      `/projects/${projectId}/activities/${activityId}/outcome-evidence-links`,
    );
  },
  // Cheap DB read (no LLM call) — the raw candidate catalog, for the
  // "manually add a pairing" picker.
  listOutcomeEvidenceCandidates(
    projectId: string,
    activityId: string,
  ): Promise<{ candidates: OutcomeEvidenceCandidate[] }> {
    return request(
      `/projects/${projectId}/activities/${activityId}/outcome-evidence-candidates`,
    );
  },
  // Bulk counterpart to removeOutcomeEvidenceLink above — clears every
  // confirmed link for one activity in one call, backing the panel's
  // "Alle entfernen" action.
  removeAllOutcomeEvidenceConfirmedLinks(
    projectId: string,
    activityId: string,
  ): Promise<{ removed: number }> {
    return request(
      `/projects/${projectId}/activities/${activityId}/outcome-evidence-links`,
      { method: "DELETE" },
    );
  },
  getLatestActivityAnalysisV2(
    activityId: string,
  ): Promise<ActivityAnalysisRunV2Record> {
    return request(`/activities/${activityId}/analysis-v2`);
  },
  // Creates an activity_analysis_v2 processing job instead of returning the
  // finished run directly — the plan/execute/narrate pipeline now runs in
  // activityAnalysisWorker.ts (ia_backend), not inline in this request. Poll
  // the returned job with useJobQuery, then re-fetch
  // getLatestActivityAnalysisV2 once it's terminal.
  runActivityAnalysisV2(activityId: string): Promise<ProcessingJobRecord> {
    return request(`/activities/${activityId}/analysis-v2`, {
      method: "POST",
    });
  },
  // Answers a batch of clarification questions in one call so the replan
  // job only replans once instead of once per question — answering N
  // questions individually used to cost N full replan jobs, most of them
  // wasted since the others were still unanswered anyway. Persisting the
  // answers is synchronous; the resulting replan runs as a new
  // activity_analysis_v2 job, same as runActivityAnalysisV2 above.
  answerActivityAnalysisV2Questions(
    activityId: string,
    payload: AnswerActivityAnalysisV2QuestionsPayload,
  ): Promise<ProcessingJobRecord> {
    return request(`/activities/${activityId}/analysis-v2/questions`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  listActivityAnalysisV2Runs(
    activityId: string,
    limit?: number,
  ): Promise<ActivityAnalysisRunV2Record[]> {
    const query = limit ? `?limit=${limit}` : "";
    return request(`/activities/${activityId}/analysis-v2/runs${query}`);
  },
  getProjectImpactStory(
    projectId: string,
  ): Promise<ProjectImpactStoryReadResult> {
    return request(`/projects/${projectId}/impact-story`);
  },
  getProjectAnalytics(
    projectId: string,
  ): Promise<ProjectImpactStoryReadResult> {
    return request(`/projects/${projectId}/analytics`);
  },
  // Creates a project_impact_story processing job instead of returning the
  // finished story directly, same job-then-poll contract as
  // runActivityAnalysisV2 above. Poll the returned job with useJobQuery,
  // then re-fetch getProjectImpactStory once it's terminal.
  runProjectImpactStory(projectId: string): Promise<ProcessingJobRecord> {
    return request(`/projects/${projectId}/impact-story`, {
      method: "POST",
    });
  },
  runProjectAnalytics(projectId: string): Promise<ProcessingJobRecord> {
    return request(`/projects/${projectId}/analytics`, {
      method: "POST",
    });
  },
  // Lets a freshly (re)mounted ProjectImpactStoryPage discover a
  // project_impact_story job it didn't personally start — e.g. one it lost
  // track of after an in-app tab switch unmounted the page while the run
  // was still going server-side — instead of only ever knowing about a job
  // via runProjectAnalytics's own return value.
  getActiveProjectAnalyticsJob(
    projectId: string,
  ): Promise<{ job: ProcessingJobRecord | null }> {
    return request(`/projects/${projectId}/analytics/active-job`);
  },
  getInterpretation(
    interpretationResultId: string,
  ): Promise<InterpretationResultRecord> {
    return request(`/interpretations/${interpretationResultId}`);
  },
  answerInterpretationQuestions(
    interpretationResultId: string,
    payload: AnswerInterpretationQuestionsPayload,
  ): Promise<InterpretationResultRecord> {
    return request(`/interpretations/${interpretationResultId}/questions`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};
