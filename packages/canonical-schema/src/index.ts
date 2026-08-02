/**
 * SpecIt Canonical Schema Package — Public API
 *
 * This package is the single source of truth for:
 *   - Material type definitions (Sheet 01)
 *   - Canonical field definitions (Sheet 02)
 *   - Type × Field applicability matrix (Sheet 03)
 *   - Completeness scoring rules (Sheet 08)
 *   - API contract types (specit-api-v1.yaml)
 *
 * Import from: @specit/canonical-schema
 */

// Tiers & scoring constants
export {
  FIELD_TIERS,
  FIELD_WEIGHTS,
  SCORE_BANDS,
  type FieldTier,
  type FieldApplicability,
  type ScoreBandKey,
} from './tiers';

// Material types registry
export {
  MATERIAL_TYPES,
  MATERIAL_TYPE_MAP,
  isValidMaterialType,
  getMaterialType,
  type MaterialTypeDefinition,
  type MaterialApplication,
  type MaterialLocation,
} from './material-types'

// Canonical field definitions
export {
  CANONICAL_FIELDS,
  FIELD_MAP,
  getField,
  ENUMS,
  type CanonicalField,
  type FieldDataType,
  type FieldGroup,
} from './fields'

// Type × Field matrix
export {
  TYPE_FIELD_MATRIX,
  getFieldApplicability,
  type TypeFieldMatrix,
} from './type-field-matrix'

// Completeness scoring engine
export {
  calculateCompleteness,
  getScoreBand,
  deriveStatus,
  isFilled,
  type MaterialData,
  type CompletenessResult,
  type ScoredField,
} from './scoring'

// API contract types
export type {
  MatchingFields,
  MaterialSummary,
  SearchResult,
  Dimension,
  Performance,
  Commercial,
  CommercialInput,
  Packaging,
  UVMapping,
  PBR,
  AssetRef,
  Assets,
  Standards,
  SystemMeta,
  Material,
  MaterialInput,
  MaterialDraft,
  MaterialDraftField,
  ExtractionResult,
  MaterialTypeResponse,
  TypeSchema,
  TypeSchemaField,
  Supplier,
  SupplierMaterial,
  ApiError,
  SearchParams,
} from './api-types'
