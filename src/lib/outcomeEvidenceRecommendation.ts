interface ColumnReferenceIdentity {
  uploadMetadataId: string;
  tableName: string;
  columnName: string;
}

export type OutcomeEvidenceRecommendationIdentity =
  | {
      shape: "paired_delta";
      before: ColumnReferenceIdentity;
      after: ColumnReferenceIdentity;
    }
  | {
      shape: "paired_categorical_shift";
      before: ColumnReferenceIdentity;
      after: ColumnReferenceIdentity;
    }
  | { shape: "single_distribution"; column: ColumnReferenceIdentity };

export function recommendationKey(
  recommendation: OutcomeEvidenceRecommendationIdentity,
) {
  if (
    recommendation.shape === "paired_delta" ||
    recommendation.shape === "paired_categorical_shift"
  ) {
    return [
      recommendation.shape,
      recommendation.before.uploadMetadataId,
      recommendation.before.tableName,
      recommendation.before.columnName,
      recommendation.after.uploadMetadataId,
      recommendation.after.tableName,
      recommendation.after.columnName,
    ].join("|");
  }

  return [
    "single_distribution",
    recommendation.column.uploadMetadataId,
    recommendation.column.tableName,
    recommendation.column.columnName,
  ].join("|");
}
