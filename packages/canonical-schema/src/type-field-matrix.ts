/**
 * SpecIt — Type × Field Matrix
 * Source: Canonical Schema v3, Sheet 03 (Type_vs_Field)
 *
 * Defines which fields apply to each material type, and whether
 * each field is required (● weight 3) or optional (○ weight 1).
 * Fields marked "—" are not applicable (excluded from scoring denominator).
 *
 * ● = required (weight 3)
 * ○ = optional (weight 1)
 * — = not applicable (excluded from score)
 */

import type { FieldApplicability } from './tiers'
import type { MaterialTypeDefinition } from './material-types'

export type TypeFieldMatrix = Readonly<Record<string, Readonly<Record<string, FieldApplicability>>>>;

/**
 * Short type aliases for readability — column headers from Sheet 03.
 */
type T = 'gạch' | 'đá_tn' | 'sàn_gỗ' | 'vinyl' | 'sơn' | 'giấy_dán' | 'ốp_tường' | 'trần' | 'đá_nt' | 'kính' | 'vải_da';

const materialTypeByAlias: Record<T, MaterialTypeDefinition['material_type_id']> = {
  'gạch': 'ceramic_tile',
  'đá_tn': 'natural_stone_tile',
  'sàn_gỗ': 'engineered_wood',
  'vinyl': 'vinyl_spc',
  'sơn': 'paint',
  'giấy_dán': 'wallpaper',
  'ốp_tường': 'wall_panel',
  'trần': 'ceiling_tile',
  'đá_nt': 'quartz_surface',
  'kính': 'glass',
  'vải_da': 'fabric_leather',
};

/**
 * Raw matrix from Sheet 03.
 * Legend: ● = required, ○ = optional, — = n/a
 * Each entry: [field_id]: { gạch, đá_tn, sàn_gỗ, vinyl, sơn, giấy_dán, ốp_tường, trần, đá_nt, kính, vải_da }
 */
const RAW_MATRIX: Readonly<Record<string, Partial<Record<T, FieldApplicability>>>> = {
  width_mm:              { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', giấy_dán: 'required', ốp_tường: 'required', trần: 'required', đá_nt: 'required', kính: 'required', vải_da: 'required' },
  height_mm:             { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', giấy_dán: 'required', ốp_tường: 'required', trần: 'required', đá_nt: 'required', kính: 'required', vải_da: 'required' },
  thickness_mm:          { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', giấy_dán: 'optional', ốp_tường: 'required', trần: 'required', đá_nt: 'required', kính: 'required', vải_da: 'optional' },
  pieces_per_box:        { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', ốp_tường: 'required', trần: 'required', đá_nt: 'required' },
  slip_rating:           { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'optional', vinyl: 'optional' },
  pei_rating:            { gạch: 'required' },
  water_absorption:      { gạch: 'required', đá_tn: 'required', ốp_tường: 'optional' },
  ac_rating:             { sàn_gỗ: 'required', vinyl: 'required' },
  fire_rating:           { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'optional', vinyl: 'optional', sơn: 'optional', giấy_dán: 'optional', ốp_tường: 'required', trần: 'required', đá_nt: 'optional', kính: 'required', vải_da: 'optional' },
  voc_level:             { sơn: 'required', giấy_dán: 'optional', ốp_tường: 'optional' },
  coverage_m2_per_unit:  { sơn: 'required' },
  finish:                { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', sơn: 'required', giấy_dán: 'optional', ốp_tường: 'required', trần: 'optional', đá_nt: 'required', kính: 'required', vải_da: 'optional' },
  edge_type:             { gạch: 'required', đá_tn: 'required', vinyl: 'required', ốp_tường: 'optional', đá_nt: 'optional' },
  installation_method:   { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'required', vinyl: 'required', giấy_dán: 'optional', ốp_tường: 'optional', đá_nt: 'optional' },
  recommended_joint_mm:  { gạch: 'optional', đá_tn: 'optional' },
  pattern:               { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'required', vinyl: 'optional', giấy_dán: 'required', ốp_tường: 'optional', trần: 'optional', đá_nt: 'optional', vải_da: 'required' },
  texture_diffuse:       { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', sơn: 'required', giấy_dán: 'required', ốp_tường: 'required', trần: 'required', đá_nt: 'required', kính: 'optional', vải_da: 'required' },
  texture_normal:        { gạch: 'optional', đá_tn: 'required', sàn_gỗ: 'optional', vinyl: 'optional', giấy_dán: 'optional', ốp_tường: 'optional', đá_nt: 'optional' },
  tile_repeat_x:         { gạch: 'required', đá_tn: 'required', sàn_gỗ: 'required', vinyl: 'required', giấy_dán: 'required', ốp_tường: 'required', trần: 'required', đá_nt: 'required', vải_da: 'required' },
  uv_rotation:           { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'required', vinyl: 'optional', giấy_dán: 'optional', ốp_tường: 'optional', đá_nt: 'optional' },
  style_tags:            { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'optional', vinyl: 'optional', sơn: 'optional', giấy_dán: 'optional', ốp_tường: 'optional', trần: 'optional', đá_nt: 'optional', kính: 'optional', vải_da: 'optional' },
  space_type:            { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'optional', vinyl: 'optional', sơn: 'optional', giấy_dán: 'optional', ốp_tường: 'optional', trần: 'optional', đá_nt: 'optional', kính: 'optional', vải_da: 'optional' },
  certification:         { gạch: 'optional', đá_tn: 'optional', sàn_gỗ: 'optional', vinyl: 'optional', sơn: 'optional', giấy_dán: 'optional', ốp_tường: 'optional', trần: 'optional', đá_nt: 'optional', kính: 'optional', vải_da: 'optional' },
} as const;

/**
 * Build the full lookup: material_type_id → { field_id → applicability }
 */
function buildMatrix(): TypeFieldMatrix {
  const result: Record<string, Record<string, FieldApplicability>> = {};

  // Initialize all known types
  for (const alias of Object.keys(materialTypeByAlias) as T[]) {
    const typeId = materialTypeByAlias[alias];
    result[typeId] = {};
  }

  // Populate from raw matrix
  for (const [fieldId, typeMap] of Object.entries(RAW_MATRIX)) {
    for (const [alias, applicability] of Object.entries(typeMap)) {
      const typeId = materialTypeByAlias[alias as T];
      if (typeId) {
        result[typeId][fieldId] = applicability as FieldApplicability;
      }
    }
  }

  return result;
}

export const TYPE_FIELD_MATRIX: TypeFieldMatrix = buildMatrix();

/**
 * Fields that ARE in the RAW_MATRIX are type-specific.
 * If a material type doesn't list them, they are n_a (not applicable).
 * Sheet 03 uses "—" explicitly for these cases.
 */
const MATRIX_FIELD_IDS = new Set(Object.keys(RAW_MATRIX));

/**
 * Universal required fields — apply to ALL material types.
 * These are NOT in the matrix because they don't vary by type.
 */
const UNIVERSAL_REQUIRED = new Set([
  'product_name', 'material_type', 'supplier_id', 'brand',
  'price_per_box', 'price_unit_original', 'currency',
  'application', 'location',
  'color_family', 'finish',
  'product_image',
]);

/**
 * Universal optional fields — apply to ALL material types but are optional.
 */
const UNIVERSAL_OPTIONAL = new Set([
  'model_number', 'collection_name', 'country_of_origin',
  'supplier_color_name',
  'style_tags', 'space_type',
  'certification',
  'warranty_years',
  'price_type', 'availability', 'moq', 'lead_time_days',
  'texture_normal', 'texture_roughness', 'texture_ao', 'product_image_room',
]);

/**
 * Excluded from scoring entirely (SYS, derived, audit-only).
 */
const EXCLUDED_FROM_SCORING = new Set([
  'id', 'sku_id', 'status', 'created_at', 'updated_at', 'created_by',
  'version', 'completeness_score', 'source_type', 'review_status',
  'raw_extraction_id', 'spec_sheet_pdf', 'content_hash',
  'price_value', 'price_unit', 'price_segment', 'tone', 'color_hex',
  'pattern', // T2 derived — scored via its matrix entry if applicable
  'pieces_per_m2', 'box_coverage_m2', 'tile_repeat_x', 'tile_repeat_y',
  'pbr_base_color', 'pbr_metallic', 'pbr_roughness', 'pbr_opacity',
  'pbr_ior', 'pbr_bump_scale',
  'clearcoat_weight', 'sheen_weight', 'sss_weight', 'transmission_weight',
  'thermal_conductivity', 'density_kg_m3', 'sound_absorption_nrc',
  'u_value', 'embodied_carbon',
]);

/**
 * Get the applicability of a field for a given material type.
 *
 * Priority:
 *   1. If field is in the type×field matrix → use explicit value (●/○/—)
 *   2. If field is a matrix field but not listed for this type → n_a
 *   3. If field is universally required → required
 *   4. If field is universally optional → optional
 *   5. If field is excluded from scoring → n_a
 *   6. Default → optional
 */
export function getFieldApplicability(
  materialType: string,
  fieldId: string,
): FieldApplicability {
  // 1. Check explicit matrix first
  const typeFields = TYPE_FIELD_MATRIX[materialType];
  if (typeFields && fieldId in typeFields) {
    return typeFields[fieldId];
  }

  // 2. Matrix field not listed for this type → not applicable
  if (MATRIX_FIELD_IDS.has(fieldId)) {
    return 'n_a';
  }

  // 3. Universal required
  if (UNIVERSAL_REQUIRED.has(fieldId)) return 'required';

  // 4. Universal optional
  if (UNIVERSAL_OPTIONAL.has(fieldId)) return 'optional';

  // 5. Excluded
  if (EXCLUDED_FROM_SCORING.has(fieldId)) return 'n_a';

  // 6. Default
  return 'optional';
}
