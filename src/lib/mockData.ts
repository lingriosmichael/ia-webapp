import type { TFunction } from 'i18next';

export type EvidenceStatus = 'healthy' | 'needs-review' | 'missing';

export interface ActivityBrief {
  name: string;
  description: string;
  objectives: string;
  targetAudience: string;
  expectedOutcomes: string;
  successIndicators: string;
  additionalNotes: string;
}

export interface Activity {
  id: string;
  name: string;
  brief: ActivityBrief;
  hasDataset: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  evidenceStatus: EvidenceStatus;
  activities: Activity[];
}

export const project: Project = {
  id: 'mentoring-q3-2026',
  name: 'Mentoring Programme Q3 2026',
  description:
    'Cross-district youth mentoring programme running July–September 2026. Combines senior mentor training, structured youth onboarding, and weekly 1:1 mentoring sessions across four districts.',
  lastUpdated: 'Just now',
  evidenceStatus: 'healthy',
  activities: [],
};

export type PrivacyCategory =
  | 'Direct Identifier'
  | 'Quasi Identifier'
  | 'High Risk'
  | 'Operational'
  | 'Outcome';

export type Transformation = 'Hashed' | 'Removed' | 'Generalised' | 'Kept';

export interface SchemaColumn {
  original: string;
  semantic: string;
  privacy: PrivacyCategory;
  transformation: Transformation;
  confidence: number;
  clarifyingQuestion?: string;
  clarifyingOptions?: string[];
  reasoning?: string[];
  sampleValues?: string[];
}

export function getSchema(t: TFunction): SchemaColumn[] {
  return [
    {
      original: 'participant_name',
      semantic: t('schemaReview.schema.participant_name.semantic'),
      privacy: 'Direct Identifier',
      transformation: 'Hashed',
      confidence: 0.98,
      reasoning: t('schemaReview.schema.participant_name.reasoning', {
        returnObjects: true,
      }) as string[],
      sampleValues: t('schemaReview.schema.participant_name.sampleValues', {
        returnObjects: true,
      }) as string[],
    },
    {
      original: 'email',
      semantic: t('schemaReview.schema.email.semantic'),
      privacy: 'Direct Identifier',
      transformation: 'Hashed',
      confidence: 0.99,
      reasoning: t('schemaReview.schema.email.reasoning', {
        returnObjects: true,
      }) as string[],
      sampleValues: t('schemaReview.schema.email.sampleValues', {
        returnObjects: true,
      }) as string[],
    },
    { original: 'age_group', semantic: t('schemaReview.schema.age_group.semantic'), privacy: 'Quasi Identifier', transformation: 'Generalised', confidence: 0.94 },
    {
      original: 'district',
      semantic: t('schemaReview.schema.district.semantic'),
      privacy: 'Quasi Identifier',
      transformation: 'Kept',
      confidence: 0.92,
      reasoning: t('schemaReview.schema.district.reasoning', {
        returnObjects: true,
      }) as string[],
      sampleValues: t('schemaReview.schema.district.sampleValues', {
        returnObjects: true,
      }) as string[],
    },
    { original: 'sessions_attended', semantic: t('schemaReview.schema.sessions_attended.semantic'), privacy: 'Operational', transformation: 'Kept', confidence: 0.97 },
    { original: 'total_sessions', semantic: t('schemaReview.schema.total_sessions.semantic'), privacy: 'Operational', transformation: 'Kept', confidence: 0.96 },
    { original: 'completed_program', semantic: t('schemaReview.schema.completed_program.semantic'), privacy: 'Outcome', transformation: 'Kept', confidence: 0.95 },
    { original: 'pre_confidence_score', semantic: t('schemaReview.schema.pre_confidence_score.semantic'), privacy: 'Outcome', transformation: 'Kept', confidence: 0.93 },
    { original: 'post_confidence_score', semantic: t('schemaReview.schema.post_confidence_score.semantic'), privacy: 'Outcome', transformation: 'Kept', confidence: 0.93 },
    {
      original: 'mentor_match_status',
      semantic: t('schemaReview.schema.mentor_match_status.semantic'),
      privacy: 'Operational',
      transformation: 'Kept',
      confidence: 0.71,
      clarifyingQuestion: t('schemaReview.schema.mentor_match_status.clarifyingQuestion'),
      clarifyingOptions: t('schemaReview.schema.mentor_match_status.options', {
        returnObjects: true,
      }) as string[],
      reasoning: t('schemaReview.schema.mentor_match_status.reasoning', {
        returnObjects: true,
      }) as string[],
      sampleValues: t('schemaReview.schema.mentor_match_status.sampleValues', {
        returnObjects: true,
      }) as string[],
    },
    {
      original: 'case_notes',
      semantic: t('schemaReview.schema.case_notes.semantic'),
      privacy: 'High Risk',
      transformation: 'Removed',
      confidence: 0.99,
      reasoning: t('schemaReview.schema.case_notes.reasoning', {
        returnObjects: true,
      }) as string[],
      sampleValues: t('schemaReview.schema.case_notes.sampleValues', {
        returnObjects: true,
      }) as string[],
    },
  ];
}

export const datasetOverview = {
  rows: 184,
  columns: 11,
  participants: 178,
  duplicateRows: 4,
  missingValues: 21,
  qualityScore: 0.92,
};

export function getKeyMetrics(t: TFunction) {
  return [
    { key: 'participants', label: t('projectAnalytics.metrics.participants.label'), value: '178', delta: t('projectAnalytics.metrics.participants.delta') },
    { key: 'attendanceRate', label: t('projectAnalytics.metrics.attendanceRate.label'), value: '82%', delta: t('projectAnalytics.metrics.attendanceRate.delta') },
    { key: 'programmeCompletion', label: t('projectAnalytics.metrics.programmeCompletion.label'), value: '71%', delta: t('projectAnalytics.metrics.programmeCompletion.delta') },
    { key: 'confidenceImprovement', label: t('projectAnalytics.metrics.confidenceImprovement.label'), value: '+2.3', delta: t('projectAnalytics.metrics.confidenceImprovement.delta') },
    { key: 'missingValues', label: t('projectAnalytics.metrics.missingValues.label'), value: '21', delta: t('projectAnalytics.metrics.missingValues.delta') },
    { key: 'duplicateRows', label: t('projectAnalytics.metrics.duplicateRows.label'), value: '4', delta: t('projectAnalytics.metrics.duplicateRows.delta') },
  ];
}

export function getAttendanceDistribution() {
  return [
    { bucket: '0–25%', count: 9 },
    { bucket: '26–50%', count: 18 },
    { bucket: '51–75%', count: 47 },
    { bucket: '76–100%', count: 104 },
  ];
}

export function getCompletionByAgeGroup() {
  return [
    { group: '14–15', completed: 62, dropped: 22 },
    { group: '16–17', completed: 71, dropped: 18 },
    { group: '18+', completed: 78, dropped: 12 },
  ];
}

export const confidenceImprovement = [
  { week: 'W1', pre: 4.1, post: 4.1 },
  { week: 'W3', pre: 4.1, post: 4.6 },
  { week: 'W6', pre: 4.1, post: 5.3 },
  { week: 'W9', pre: 4.1, post: 6.0 },
  { week: 'W12', pre: 4.1, post: 6.4 },
];

export function getMentorMatching(t: TFunction) {
  return [
    { name: t('projectAnalytics.mentorMatching.matched'), value: 162 },
    { name: t('projectAnalytics.mentorMatching.pending'), value: 11 },
    { name: t('projectAnalytics.mentorMatching.unmatched'), value: 5 },
  ];
}

export const trendsByWeek = [
  { week: 'W1', attendance: 96, confidence: 4.2 },
  { week: 'W2', attendance: 93, confidence: 4.4 },
  { week: 'W3', attendance: 91, confidence: 4.6 },
  { week: 'W4', attendance: 89, confidence: 4.9 },
  { week: 'W5', attendance: 85, confidence: 5.1 },
  { week: 'W6', attendance: 82, confidence: 5.3 },
  { week: 'W7', attendance: 80, confidence: 5.6 },
  { week: 'W8', attendance: 78, confidence: 5.8 },
  { week: 'W9', attendance: 77, confidence: 6.0 },
  { week: 'W10', attendance: 76, confidence: 6.2 },
  { week: 'W11', attendance: 75, confidence: 6.3 },
  { week: 'W12', attendance: 74, confidence: 6.4 },
];

export function getProjectInsights(t: TFunction) {
  return {
    executiveSummary: t('projectInsights.executiveSummary'),
    keyFindings: t('projectInsights.keyFindings', { returnObjects: true }) as string[],
    interestingPatterns: t('projectInsights.interestingPatterns', { returnObjects: true }) as string[],
    evidenceGaps: t('projectInsights.evidenceGaps', { returnObjects: true }) as string[],
    recommendations: t('projectInsights.recommendations', { returnObjects: true }) as string[],
    privacy: t('projectInsights.privacy', { returnObjects: true }) as string[],
  };
}
