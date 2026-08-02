/**
 * SpecIt — Tier Definitions
 * Source: Canonical Schema v3, Sheet 02 (TIER LEGEND)
 *
 * Tiers define WHO provides the data and WHEN:
 *   T0  → AI auto-extract (from PDF/Excel)
 *   T1  → Supplier easy input (required at onboarding)
 *   T2  → AI auto-derive (computed from T0+T1)
 *   T3  → Supplier upgrade (optional, raises completeness score)
 *   SYS → System auto (timestamps, versioning, audit)
 */
export const FIELD_TIERS = {
  T0: 'T0',
  T1: 'T1',
  T2: 'T2',
  T3: 'T3',
  SYS: 'SYS',
} as const;

export type FieldTier = (typeof FIELD_TIERS)[keyof typeof FIELD_TIERS];

/**
 * Scoring weights per Sheet 08:
 *   ● Required field = weight 3
 *   ○ Optional field = weight 1
 *   — Not applicable  = excluded from denominator
 *
 * Score = Σ(filled field weights) / Σ(all applicable weights) × 100
 */
export const FIELD_WEIGHTS = {
  REQUIRED: 3,
  OPTIONAL: 1,
} as const;

export type FieldApplicability = 'required' | 'optional' | 'n_a';

/**
 * Completeness score bands → status + visibility.
 * Source: Sheet 08 Scoring Rules.
 */
export const SCORE_BANDS = {
  DRAFT: { min: 0, max: 40, status: 'draft', visible: false },
  PARTIAL: { min: 41, max: 64, status: 'partial', visible: true },
  ACTIVE: { min: 65, max: 79, status: 'active', visible: true },
  ACTIVE_VERIFIED: { min: 80, max: 89, status: 'active', visible: true, badge: 'verified' },
  ACTIVE_PREMIUM: { min: 90, max: 100, status: 'active', visible: true, badge: 'premium' },
} as const;

export type ScoreBandKey = keyof typeof SCORE_BANDS;
