/**
 * SpecIt — API Contract Types
 * Source: specit-api-v1.yaml (Phase 01 Contract — IMMUTABLE)
 *
 * These types define the wire protocol between:
 *   Block 1 (Supplier Portal) ↔ Block 2 (Spec Engine) ↔ Block 3 (Architect Plugin)
 *
 * Breaking changes → /v2. Never modify existing field names/types.
 */

// ─────────────────────────────────────────────────────────────
// MATCHING LAYER (lightweight — for search/filter)
// ─────────────────────────────────────────────────────────────

export interface MatchingFields {
  application: string[];
  location: string[];
  color_family: string;
  color_hex: string;
  tone: 'warm' | 'cool' | 'neutral';
  pattern: string;
  finish: string;
  style_tags: string[];
  space_type: string[];
  price_segment: 'budget' | 'mid' | 'premium' | 'luxury';
  slip_rating: string;
}

export interface MaterialSummary {
  id: string;
  sku_id: string;
  product_name: string;
  material_type: string;
  brand: string;
  collection_name: string;
  thumbnail_url: string;
  matching: MatchingFields;
  price_value: number;
  price_unit: string;
  completeness_score: number;
  status: 'draft' | 'partial' | 'active' | 'discontinued';
}

export interface SearchResult {
  results: (MaterialSummary & {
    relevance_score: number;
    final_rank_score: number;
  })[];
  next_cursor: string | null;
}

// ─────────────────────────────────────────────────────────────
// FULL MATERIAL (matching + payload)
// ─────────────────────────────────────────────────────────────

export interface Dimension {
  width_mm: number;
  height_mm: number;
  thickness_mm: number;
  weight_kg_m2?: number;
  pieces_per_m2?: number;
  edge_type?: string;
}

export interface Performance {
  slip_rating?: string;
  pei_rating?: string;
  water_absorption?: number;
  ac_rating?: string;
  fire_rating?: string;
  voc_level?: string;
  coverage_m2_per_unit?: number;
  breaking_strength_n?: number;
  chemical_resistance?: string;
  warranty_years?: number;
  certification?: string[];
  installation_method?: 'mortar' | 'adhesive' | 'click_lock' | 'nail' | 'glue';
  recommended_joint_mm?: number;
}

export interface Commercial {
  price_per_box?: number;
  price_unit_original?: string;
  price_value?: number;
  price_unit?: string;
  price_type: 'fixed' | 'quote_required' | 'range';
  price_min?: number;
  price_max?: number;
  currency: 'VND' | 'USD';
  vat_included: boolean;
  moq?: string;
  lead_time_days?: number;
  availability?: 'in_stock' | 'made_to_order' | 'discontinued';
}

export interface CommercialInput {
  price_per_box: number;
  price_unit_original: string;
  price_type?: 'fixed' | 'quote_required' | 'range';
  price_min?: number;
  price_max?: number;
  currency: 'VND' | 'USD';
  vat_included?: boolean;
  moq?: string;
  lead_time_days?: number;
  availability?: 'in_stock' | 'made_to_order' | 'discontinued';
}

export interface Packaging {
  pieces_per_box?: number;
  box_coverage_m2?: number;
  box_weight_kg?: number;
  boxes_per_pallet?: number;
}

export interface UVMapping {
  tile_repeat_x: number;
  tile_repeat_y: number;
  uv_rotation?: number;
}

export interface PBR {
  base_color: string;
  metallic: number;
  roughness: number;
  opacity: number;
  ior: number;
  emissive_color?: string;
  bump_scale?: number;
}

export interface AssetRef {
  url: string;
  content_hash: string;
}

export interface Assets {
  texture_diffuse?: AssetRef;
  texture_normal?: AssetRef;
  texture_roughness?: AssetRef;
  texture_ao?: AssetRef;
  product_image?: AssetRef;
  product_image_room?: AssetRef;
  spec_sheet_pdf?: AssetRef;
}

export interface Standards {
  csi_masterformat: string;
  tcvn: string;
  iso?: string[];
  national_code?: string;
}

export interface SystemMeta {
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
  completeness_score: number;
  source_type: 'excel_upload' | 'pdf_extract' | 'manual' | 'api';
  review_status: 'pending' | 'auto_approved' | 'human_reviewed' | 'flagged';
  raw_extraction_id?: string;
}

export interface Material {
  id: string;
  sku_id: string;
  product_name: string;
  material_type: string;
  supplier_id: string;
  brand: string;
  model_number?: string;
  collection_name?: string;
  country_of_origin?: string;
  supplier_color_name?: string;
  status: 'draft' | 'partial' | 'active' | 'discontinued';
  matching: MatchingFields;
  dimension: Dimension;
  performance: Performance;
  commercial: Commercial;
  packaging: Packaging;
  uv_mapping?: UVMapping;
  pbr?: PBR;
  standards: Standards;
  system: SystemMeta;
}

export interface MaterialInput {
  product_name: string;
  material_type: string;
  supplier_id: string;
  brand?: string;
  model_number?: string;
  collection_name?: string;
  country_of_origin?: string;
  supplier_color_name?: string;
  matching?: Partial<MatchingFields>;
  dimension?: Partial<Dimension>;
  performance?: Partial<Performance>;
  commercial?: CommercialInput;
  packaging?: Partial<Packaging>;
  raw_extraction_id?: string;
}

// ─────────────────────────────────────────────────────────────
// EXTRACTION
// ─────────────────────────────────────────────────────────────

export interface MaterialDraftField {
  value: unknown;
  confidence: number;
  source_text?: string;
}

export interface MaterialDraft {
  material_type: string;
  fields: Record<string, MaterialDraftField>;
}

export interface ExtractionResult {
  raw_extraction_id: string;
  extraction_confidence: number;
  drafts: MaterialDraft[];
}

// ─────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────

export interface MaterialTypeResponse {
  material_type_id: string;
  name_vi: string;
  name_en: string;
  application: string[];
  location: string[];
  price_unit: string;
  csi_section: string;
  tcvn: string;
}

export interface TypeSchemaField {
  field_id: string;
  required: boolean;
  tier: 'T0' | 'T1' | 'T2' | 'T3' | 'SYS';
  weight: number;
  data_type: string;
  enum_values?: string[];
}

export interface TypeSchema {
  material_type_id: string;
  fields: TypeSchemaField[];
}

// ─────────────────────────────────────────────────────────────
// SUPPLIERS
// ─────────────────────────────────────────────────────────────

export interface Supplier {
  supplier_id: string;
  name: string;
  brand?: string;
  email: string;
  created_at: string;
}

export interface SupplierMaterial extends MaterialSummary {
  spec_count: number;
}

// ─────────────────────────────────────────────────────────────
// ERROR
// ─────────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>[];
  };
}

// ─────────────────────────────────────────────────────────────
// SEARCH PARAMS
// ─────────────────────────────────────────────────────────────

export interface SearchParams {
  type?: string;
  application?: string;
  location?: string;
  color_family?: string;
  style_tags?: string;
  space_type?: string;
  price_max?: number;
  price_min?: number;
  min_completeness?: number;
  q?: string;
  limit?: number;
  cursor?: string;
}
