// Legacy literal baked into analytics results persisted before the backend
// started detecting the source data's language and baking in a proper
// replacement text (see analyticsDashboardBuilderService.ts in ia_backend).
// This file mirrors that same detection heuristic so old, already-persisted
// "Unknown" labels resolve the same way, using the widget's own sibling
// labels rather than the app's current UI language.
const LEGACY_MISSING_CATEGORY_LITERAL = "Unknown";

const MISSING_CATEGORY_LABEL_BY_LANGUAGE = {
  de: "Nicht angegeben",
  en: "Not specified",
} as const;

const GERMAN_STOPWORDS = new Set([
  "und",
  "oder",
  "nicht",
  "kein",
  "keine",
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "ein",
  "eine",
  "einen",
  "einem",
  "eines",
  "mit",
  "für",
  "auf",
  "noch",
  "auch",
  "bei",
  "wegen",
  "mehr",
  "sehr",
  "als",
  "wie",
  "aber",
  "ist",
  "sind",
  "wurde",
  "wurden",
  "wird",
  "werden",
]);
const ENGLISH_STOPWORDS = new Set([
  "the",
  "and",
  "or",
  "not",
  "no",
  "a",
  "an",
  "with",
  "for",
  "on",
  "yet",
  "also",
  "at",
  "due",
  "more",
  "very",
  "than",
  "as",
  "but",
  "is",
  "are",
  "was",
  "were",
  "will",
  "be",
]);
const GERMAN_DIACRITIC_PATTERN = /[äöüßÄÖÜ]/;

function detectCategoryValueLanguage(values: readonly string[]): "de" | "en" {
  let germanScore = 0;
  let englishScore = 0;

  for (const value of values) {
    if (GERMAN_DIACRITIC_PATTERN.test(value)) {
      germanScore += 2;
    }

    for (const word of value.toLowerCase().match(/[a-zäöüß]+/g) ?? []) {
      if (GERMAN_STOPWORDS.has(word)) {
        germanScore += 1;
      }
      if (ENGLISH_STOPWORDS.has(word)) {
        englishScore += 1;
      }
    }
  }

  // "de" is this app's default language, used when detection is inconclusive.
  return englishScore > germanScore ? "en" : "de";
}

export function resolveCategoryLabels(labels: readonly string[]): string[] {
  const knownLabels = labels.filter(
    (label) => label !== LEGACY_MISSING_CATEGORY_LITERAL,
  );
  const missingValueLabel =
    MISSING_CATEGORY_LABEL_BY_LANGUAGE[
      detectCategoryValueLanguage(knownLabels)
    ];

  return labels.map((label) =>
    label === LEGACY_MISSING_CATEGORY_LITERAL
      ? missingValueLabel
      : label.charAt(0).toUpperCase() + label.slice(1),
  );
}
