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
  | { shape: "single_distribution"; column: ColumnReferenceIdentity };

export function recommendationKey(
  recommendation: OutcomeEvidenceRecommendationIdentity,
) {
  return recommendation.shape === "paired_delta"
    ? [
        "paired_delta",
        recommendation.before.uploadMetadataId,
        recommendation.before.tableName,
        recommendation.before.columnName,
        recommendation.after.uploadMetadataId,
        recommendation.after.tableName,
        recommendation.after.columnName,
      ].join("|")
    : [
        "single_distribution",
        recommendation.column.uploadMetadataId,
        recommendation.column.tableName,
        recommendation.column.columnName,
      ].join("|");
}
