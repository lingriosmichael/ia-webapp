import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/badge";

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>;

/**
 * How much attention a piece of content deserves, independent of what
 * domain-specific enum produced it (a readiness level, an evidence
 * strength, an action priority, ...). Mapping each domain enum to one of
 * these four buckets first, then looking up the Badge variant from this
 * single table, keeps every "how severe is this" signal in the app visually
 * consistent — a safety-critical badge always outranks a purely descriptive
 * one, and there is exactly one place to change if that visual language
 * ever changes.
 */
export type AttentionLevel = "critical" | "caution" | "neutral" | "positive";

export const ATTENTION_BADGE_VARIANT: Record<AttentionLevel, BadgeVariant> = {
  critical: "destructive",
  caution: "secondary",
  neutral: "outline",
  positive: "default",
};

export function getAttentionBadgeVariant(level: AttentionLevel): BadgeVariant {
  return ATTENTION_BADGE_VARIANT[level];
}
