import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

/** Every card/chart/sentence an LLM chose to feature must carry this,
 * distinct from a plain generated-at timestamp — see "Phase 5 —
 * Deterministic Analytics.md", Principle 6. Never attach this to a value
 * the LLM didn't select; the badge means "curated", not "computed". */
export function AiCuratedBadge() {
  const { t } = useTranslation();

  return (
    <Badge
      variant="secondary"
      className="gap-1 text-[11px] font-medium text-primary"
    >
      <Sparkles className="h-3 w-3" />
      {t("analytics.aiCurated")}
    </Badge>
  );
}
