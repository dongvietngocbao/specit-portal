/**
 * SpecIt — Completeness Scoring Engine
 * Source: Canonical Schema v3, Sheet 08 (Scoring_Rules)
 *
 * Scoring formula:
 *   score = Σ(filled field weight) / Σ(all applicable field weights) × 100
 *
 * Field weights (per Sheet 08):
 *   ● required = weight 3
 *   ○ optional = weight 1
 *   — not applicable = excluded from denominator
 *
 * Score bands → status + visibility:
 *   0–40%   → draft (not visible to architects)
 *   41–64%  → partial (visible + "Missing data" badge)
 *   65–79%  → active (normal display)
 *   80–89%  → active ★ (Verified badge, priority recommend)
 *   90–100% → active ★★ (Premium badge, top recommend)
 */

import { FIELD_WEIGHTS } from './tiers'
import { getFieldApplicability } from './type-field-matrix'
import { CANONICAL_FIELDS } from './fields'
import type { CanonicalField } from './fields'
import { SCORE_BANDS } from './tiers'
import type { ScoreBandKey } from './tiers'

export interface ScoredField {
  field_id: string;
  label_vi: string;
  tier: string;
  group: string;
  applicability: 'required' | 'optional';
  weight: number;
  filled: boolean;
  /** Points earned from this field */
  earned: number;
  /** Maximum possible points from this field */
  max: number;
}

export interface CompletenessResult {
  /** 0–100 integer */
  score: number;
  status: 'draft' | 'partial' | 'active' | 'discontinued';
  band: ScoreBandKey;
  badge?: 'verified' | 'premium';
  visible: boolean;
  /** Detailed per-field breakdown for UI display */
  fields: ScoredField[];
  /** Fields that are missing and would raise the score if filled */
  gaps: ScoredField[];
  /** Points earned / max possible */
  earned: number;
  max: number;
  /** Number of fields filled / total applicable */
  filled_count: number;
  total_count: number;
}

/** A material record — keyed by field_id with any value (null/undefined = unfilled) */
export type MaterialData = Record<string, unknown>;

/**
 * Check if a field value counts as "filled".
 * null, undefined, empty string, empty array → not filled.
 * 0 or false → filled (explicit value).
 */
export function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

/**
 * Determine if a field participates in scoring.
 * SYS fields, derived fields, and n_a fields are excluded.
 */
function isScorableField(field: CanonicalField): boolean {
  if (field.tier === 'SYS') return false;
  if (field.derived) return false;
  // Exclude files that are audit-only (spec_sheet_pdf)
  if (field.field_id === 'spec_sheet_pdf') return false;
  return true;
}

/**
 * Calculate completeness score for a material record.
 *
 * @param materialType - e.g. "ceramic_tile"
 * @param data - the material record with field values
 * @returns Detailed breakdown + final score
 */
export function calculateCompleteness(
  materialType: string,
  data: MaterialData,
): CompletenessResult {
  const scoredFields: ScoredField[] = [];
  let earned = 0;
  let max = 0;
  let filledCount = 0;
  let totalCount = 0;

  for (const field of CANONICAL_FIELDS) {
    if (!isScorableField(field)) continue;

    const applicability = getFieldApplicability(materialType, field.field_id);
    if (applicability === 'n_a') continue;

    const weight = applicability === 'required' ? FIELD_WEIGHTS.REQUIRED : FIELD_WEIGHTS.OPTIONAL;
    const filled = isFilled(data[field.field_id]);

    const sf: ScoredField = {
      field_id: field.field_id,
      label_vi: field.label_vi,
      tier: field.tier,
      group: field.group,
      applicability: applicability as 'required' | 'optional',
      weight,
      filled,
      earned: filled ? weight : 0,
      max: weight,
    };

    scoredFields.push(sf);
    earned += sf.earned;
    max += sf.max;
    totalCount += 1;
    if (filled) filledCount += 1;
  }

  const score = max > 0 ? Math.round((earned / max) * 100) : 0;
  const band = getScoreBand(score);
  const bandDef = SCORE_BANDS[band];

  const gaps = scoredFields
    .filter((f) => !f.filled)
    .sort((a, b) => b.weight - a.weight); // required gaps first

  return {
    score,
    status: bandDef.status,
    band,
    badge: 'badge' in bandDef ? (bandDef as { badge: string }).badge as 'verified' | 'premium' : undefined,
    visible: bandDef.visible,
    fields: scoredFields,
    gaps,
    earned,
    max,
    filled_count: filledCount,
    total_count: totalCount,
  };
}

/** Determine score band from a 0–100 score */
export function getScoreBand(score: number): ScoreBandKey {
  if (score <= 40) return 'DRAFT';
  if (score <= 64) return 'PARTIAL';
  if (score <= 79) return 'ACTIVE';
  if (score <= 89) return 'ACTIVE_VERIFIED';
  return 'ACTIVE_PREMIUM';
}

/**
 * Derive SKU status from score (per Sheet 08 rules).
 * NOTE: 'discontinued' is a manual status — it overrides the score-derived status.
 */
export function deriveStatus(score: number): 'draft' | 'partial' | 'active' {
  if (score <= 40) return 'draft';
  if (score <= 64) return 'partial';
  return 'active';
}
