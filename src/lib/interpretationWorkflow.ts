import type {
  DatasetPreparationRecord,
  DeterministicAnalysisRecord,
  EvidenceModality,
  InterpretationQuestion,
  InterpretationQuestionDomain,
  InterpretationResultRecord,
} from "@/services/apiClient";

export type AnalyticsReadinessState =
  | "no_results"
  | "awaiting_preparation"
  | "awaiting_analysis"
  | "ready_to_generate"
  | "ready";

export interface AnalyticsReadinessSummary {
  state: AnalyticsReadinessState;
  quantitativeResultCount: number;
  preparationBlockedCount: number;
  awaitingAnalysisCount: number;
}

export function isPreparationDrivenModality(
  evidenceModality: EvidenceModality | null | undefined,
): boolean {
  return (
    evidenceModality === "structured_quantitative" ||
    evidenceModality === "mixed_dual_track"
  );
}

export function isQualitativeModality(
  evidenceModality: EvidenceModality | null | undefined,
): boolean {
  return (
    evidenceModality === "structured_qualitative" ||
    evidenceModality === "narrative_qualitative" ||
    evidenceModality === "mixed_dual_track"
  );
}

export function getQuestionsByDomain(
  questions: InterpretationQuestion[],
  questionDomain: InterpretationQuestionDomain,
  status?: InterpretationQuestion["status"],
): InterpretationQuestion[] {
  return questions.filter((question) => {
    if (question.questionDomain !== questionDomain) {
      return false;
    }
    return status ? question.status === status : true;
  });
}

export function isPreparationResolved(
  datasetPreparation: DatasetPreparationRecord | null | undefined,
): boolean {
  return (
    datasetPreparation?.status === "ready_for_analysis" ||
    datasetPreparation?.status === "analysis_completed"
  );
}

export function isDeterministicAnalysisReady(
  deterministicAnalysis: DeterministicAnalysisRecord | null | undefined,
): boolean {
  return deterministicAnalysis?.status === "ready";
}

export function canShowQuantitativeSynthesis(
  result: InterpretationResultRecord,
  evidenceModality: EvidenceModality | null | undefined,
): boolean {
  if (!isPreparationDrivenModality(evidenceModality)) {
    return true;
  }

  const pendingPreparationQuestions = getQuestionsByDomain(
    result.questions,
    "preparation",
    "pending",
  );
  const hasBlockingPreparationQuestion = pendingPreparationQuestions.some(
    (question) => question.isBlocking,
  );

  return (
    !hasBlockingPreparationQuestion &&
    isPreparationResolved(result.datasetPreparation) &&
    isDeterministicAnalysisReady(result.deterministicAnalysis)
  );
}

export function deriveAnalyticsReadinessSummary(
  results: InterpretationResultRecord[],
): AnalyticsReadinessSummary {
  if (results.length === 0) {
    return {
      state: "no_results",
      quantitativeResultCount: 0,
      preparationBlockedCount: 0,
      awaitingAnalysisCount: 0,
    };
  }

  const quantitativeResults = results.filter(
    (result) =>
      (result.datasetPreparation &&
        result.datasetPreparation.status !== "not_applicable") ||
      Boolean(result.deterministicAnalysis),
  );

  const preparationBlockedCount = quantitativeResults.filter((result) => {
    const pendingPreparationQuestions = getQuestionsByDomain(
      result.questions,
      "preparation",
      "pending",
    );

    return pendingPreparationQuestions.some((question) => question.isBlocking);
  }).length;

  const awaitingAnalysisCount = quantitativeResults.filter((result) => {
    const pendingPreparationQuestions = getQuestionsByDomain(
      result.questions,
      "preparation",
      "pending",
    );
    const hasBlockingPreparationQuestion = pendingPreparationQuestions.some(
      (question) => question.isBlocking,
    );

    if (hasBlockingPreparationQuestion) {
      return false;
    }

    if (!isPreparationResolved(result.datasetPreparation)) {
      return true;
    }

    // Older interpretation runs can legitimately have no deterministic
    // analysis artifact yet even though there are no open questions left.
    // That absence should not block the analytics route behind a stale
    // "still running" message; the user can regenerate analytics from the
    // latest persisted interpretation state directly.
    if (!result.deterministicAnalysis) {
      return false;
    }

    return (
      result.deterministicAnalysis.status !== "not_applicable" &&
      !isDeterministicAnalysisReady(result.deterministicAnalysis)
    );
  }).length;

  if (preparationBlockedCount > 0) {
    return {
      state: "awaiting_preparation",
      quantitativeResultCount: quantitativeResults.length,
      preparationBlockedCount,
      awaitingAnalysisCount,
    };
  }

  if (awaitingAnalysisCount > 0) {
    return {
      state: "awaiting_analysis",
      quantitativeResultCount: quantitativeResults.length,
      preparationBlockedCount,
      awaitingAnalysisCount,
    };
  }

  return {
    state: "ready_to_generate",
    quantitativeResultCount: quantitativeResults.length,
    preparationBlockedCount,
    awaitingAnalysisCount,
  };
}
