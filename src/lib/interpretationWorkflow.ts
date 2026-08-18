import type {
  DatasetPreparationRecord,
  DeterministicAnalysisRecord,
  EvidenceModality,
  InterpretationQuestion,
  InterpretationQuestionDomain,
  InterpretationResultRecord,
} from "@/services/apiClient";

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
