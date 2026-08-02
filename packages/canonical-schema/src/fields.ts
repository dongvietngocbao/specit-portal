/**
 * SpecIt — Canonical Field Definitions
 * Source: Canonical Schema v3, Sheet 02 (all 80+ fields)
 *         Canonical Schema v3, Sheet 03 (Type × Field applicability matrix)
 *
 * Each field defines:
 *   - field_id: unique identifier (matches API v1 schema)
 *   - tier: who provides it and when (T0/T1/T2/T3/SYS)
 *   - data_type: TypeScript/DB type
 *   - enum values (if applicable)
 *   - group: logical grouping for UI rendering
 *   - score_impact: how it affects completeness
 */

import type { FieldTier } from './tiers'

// ─────────────────────────────────────────────────────────────
// ENUM TYPES (from Sheet 02, column "Enum / Chuẩn")
// ─────────────────────────────────────────────────────────────

export const ENUMS = {
  status: ['draft', 'partial', 'active', 'discontinued'],
  review_status: ['pending', 'auto_approved', 'human_reviewed', 'flagged'],
  source_type: ['excel_upload', 'pdf_extract', 'manual', 'api'],

  application: ['flooring', 'wall', 'ceiling', 'countertop', 'facade', 'partition'],
  location: ['indoor', 'outdoor', 'wet_area'],
  color_family: [
    'white', 'grey', 'warm_grey', 'beige', 'brown', 'black',
    'blue', 'green', 'red', 'yellow', 'multi', 'wood_tone',
  ],
  tone: ['warm', 'cool', 'neutral'],
  pattern: [
    'solid', 'marble_vein', 'wood_grain', 'terrazzo',
    'geometric', 'floral', 'abstract', 'textured',
  ],
  finish: [
    'matte', 'gloss', 'semi_gloss', 'satin', 'lappato',
    'honed', 'polished', 'brushed', 'textured', 'rustic',
  ],
  edge_type: ['rectified', 'pressed', 'beveled', 'natural'],
  price_segment: ['budget', 'mid', 'premium', 'luxury'],
  price_type: ['fixed', 'quote_required', 'range'],
  currency: ['VND', 'USD'],
  availability: ['in_stock', 'made_to_order', 'discontinued'],
  installation_method: ['mortar', 'adhesive', 'click_lock', 'nail', 'glue'],

  slip_rating: ['R9', 'R10', 'R11', 'R12', 'R13'],
  pei_rating: ['PEI-I', 'PEI-II', 'PEI-III', 'PEI-IV', 'PEI-V'],

  asset_type: [
    'diffuse', 'normal', 'roughness', 'ao', 'bump', 'displacement',
    'photo', 'photo_room', 'specsheet',
  ],
} as const;

// ─────────────────────────────────────────────────────────────
// FIELD DEFINITIONS
// ─────────────────────────────────────────────────────────────

export type FieldDataType =
  | 'uuid'
  | 'string'
  | 'text'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'enum'
  | 'enum_array'
  | 'string_array'
  | 'object'
  | 'file'
  | 'datetime'
  | 'hex_color';

export type FieldGroup =
  | 'identity'
  | 'classification'
  | 'dimension'
  | 'packaging'
  | 'performance'
  | 'commercial'
  | 'assets'
  | 'uv_mapping'
  | 'pbr'
  | 'render_extensions'
  | 'bim_extensions'
  | 'system';

export interface CanonicalField {
  field_id: string;
  label_vi: string;
  description: string;
  tier: FieldTier;
  data_type: FieldDataType;
  group: FieldGroup;
  enum_values?: readonly string[];
  example?: string;
  score_impact?: 'high' | 'medium' | 'light' | 'none';
  /** Default value or derivation note */
  derived?: boolean;
}

// Reuse groups as constants for the matrix
const G = {
  IDENTITY: 'identity',
  CLASSIFICATION: 'classification',
  DIMENSION: 'dimension',
  PACKAGING: 'packaging',
  PERFORMANCE: 'performance',
  COMMERCIAL: 'commercial',
  ASSETS: 'assets',
  UV: 'uv_mapping',
  PBR: 'pbr',
  RENDER: 'render_extensions',
  BIM: 'bim_extensions',
  SYSTEM: 'system',
} as const satisfies Record<string, FieldGroup>;

/**
 * All 80+ canonical fields. Source: Sheet 02.
 * Order matches the canonical sheet for audit traceability.
 */
export const CANONICAL_FIELDS: readonly CanonicalField[] = [
  // ── IDENTITY ──
  { field_id: 'id', label_vi: 'ID hệ thống', description: 'UUIDv4 auto-gen, PK, folder name', tier: 'SYS', data_type: 'uuid', group: G.SYSTEM },
  { field_id: 'sku_id', label_vi: 'Mã SKU', description: 'Human-readable: TYPE-BRAND-SIZE-SEQ', tier: 'SYS', data_type: 'string', group: G.SYSTEM },
  { field_id: 'product_name', label_vi: 'Tên sản phẩm', description: 'Supplier-given display name', tier: 'T1', data_type: 'string', group: G.IDENTITY, score_impact: 'high', example: 'Viglacera Platinum TS6-620' },
  { field_id: 'material_type', label_vi: 'Loại vật liệu', description: 'FK → registry', tier: 'T0', data_type: 'enum', group: G.IDENTITY, enum_values: undefined, score_impact: 'high', example: 'ceramic_tile' },
  { field_id: 'supplier_id', label_vi: 'Nhà cung cấp', description: 'FK → suppliers', tier: 'T1', data_type: 'string', group: G.IDENTITY, example: 'SUP-VIGLACERA' },
  { field_id: 'brand', label_vi: 'Thương hiệu', description: 'Brand name', tier: 'T0', data_type: 'string', group: G.IDENTITY, score_impact: 'high', example: 'Viglacera' },
  { field_id: 'model_number', label_vi: 'Mã model', description: 'Manufacturer model code', tier: 'T0', data_type: 'string', group: G.IDENTITY, score_impact: 'high', example: 'TS6-620' },
  { field_id: 'collection_name', label_vi: 'Bộ sưu tập', description: 'Collection / product line', tier: 'T0', data_type: 'string', group: G.IDENTITY, score_impact: 'high', example: 'Marble Elite 2026' },
  { field_id: 'country_of_origin', label_vi: 'Xuất xứ', description: 'ISO 3166-1 country code', tier: 'T0', data_type: 'enum', group: G.IDENTITY, score_impact: 'light', example: 'VN' },
  { field_id: 'supplier_color_name', label_vi: 'Tên màu gốc', description: 'Original supplier color text (preserved)', tier: 'T0', data_type: 'string', group: G.IDENTITY, example: 'Vân đá Carrara trắng xám' },
  { field_id: 'status', label_vi: 'Trạng thái', description: 'SKU lifecycle', tier: 'SYS', data_type: 'enum', group: G.SYSTEM, enum_values: ENUMS.status },

  // ── CLASSIFICATION ──
  { field_id: 'application', label_vi: 'Ứng dụng', description: 'Surfaces this material can be applied to', tier: 'T0', data_type: 'enum_array', group: G.CLASSIFICATION, enum_values: ENUMS.application, score_impact: 'high', example: '["flooring","wall"]' },
  { field_id: 'location', label_vi: 'Vị trí', description: 'indoor/outdoor/wet_area', tier: 'T0', data_type: 'enum_array', group: G.CLASSIFICATION, enum_values: ENUMS.location, score_impact: 'high', example: '["indoor"]' },
  { field_id: 'color_family', label_vi: 'Họ màu', description: 'Color group for filtering + AI', tier: 'T2', data_type: 'enum', group: G.CLASSIFICATION, enum_values: ENUMS.color_family, score_impact: 'high', example: 'warm_grey', derived: true },
  { field_id: 'color_hex', label_vi: 'Mã màu', description: 'Representative hex for swatch UI', tier: 'T2', data_type: 'hex_color', group: G.CLASSIFICATION, score_impact: 'light', example: '#B8A99A', derived: true },
  { field_id: 'tone', label_vi: 'Tone màu', description: 'warm/cool/neutral', tier: 'T2', data_type: 'enum', group: G.CLASSIFICATION, enum_values: ENUMS.tone, score_impact: 'light', example: 'warm', derived: true },
  { field_id: 'pattern', label_vi: 'Hoa văn', description: 'Surface pattern type', tier: 'T2', data_type: 'enum', group: G.CLASSIFICATION, enum_values: ENUMS.pattern, score_impact: 'high', example: 'marble_vein', derived: true },
  { field_id: 'finish', label_vi: 'Bề mặt xử lý', description: 'Finish type', tier: 'T0', data_type: 'enum', group: G.CLASSIFICATION, enum_values: ENUMS.finish, score_impact: 'high', example: 'lappato' },
  { field_id: 'style_tags', label_vi: 'Phong cách', description: 'Style tags for AI Design matching', tier: 'T3', data_type: 'string_array', group: G.CLASSIFICATION, score_impact: 'high', example: '["modern","japandi"]' },
  { field_id: 'space_type', label_vi: 'Không gian', description: 'Suitable room types', tier: 'T3', data_type: 'string_array', group: G.CLASSIFICATION, score_impact: 'high', example: '["living_room","bathroom"]' },
  { field_id: 'price_segment', label_vi: 'Phân khúc giá', description: 'Auto-calc from price', tier: 'T2', data_type: 'enum', group: G.CLASSIFICATION, enum_values: ENUMS.price_segment, example: 'mid', derived: true },

  // ── DIMENSION / PHYSICAL ──
  { field_id: 'width_mm', label_vi: 'Chiều rộng (mm)', description: 'Width edge', tier: 'T0', data_type: 'number', group: G.DIMENSION, score_impact: 'high', example: '600' },
  { field_id: 'height_mm', label_vi: 'Chiều cao/dài (mm)', description: 'Height/length edge', tier: 'T0', data_type: 'number', group: G.DIMENSION, score_impact: 'high', example: '600' },
  { field_id: 'thickness_mm', label_vi: 'Độ dày (mm)', description: 'Panel thickness', tier: 'T0', data_type: 'number', group: G.DIMENSION, score_impact: 'high', example: '10' },
  { field_id: 'weight_kg_m2', label_vi: 'Trọng lượng (kg/m²)', description: 'Weight per m²', tier: 'T3', data_type: 'number', group: G.DIMENSION, score_impact: 'light', example: '22.5' },
  { field_id: 'pieces_per_m2', label_vi: 'Số viên/m²', description: 'Auto-calc from dimensions', tier: 'T2', data_type: 'number', group: G.DIMENSION, example: '2.78', derived: true },
  { field_id: 'edge_type', label_vi: 'Kiểu cạnh', description: 'Edge treatment', tier: 'T0', data_type: 'enum', group: G.DIMENSION, enum_values: ENUMS.edge_type, score_impact: 'light', example: 'rectified' },

  // ── PACKAGING / LOGISTICS ──
  { field_id: 'pieces_per_box', label_vi: 'Số viên/hộp', description: 'Pieces per box', tier: 'T0', data_type: 'number', group: G.PACKAGING, score_impact: 'high', example: '4' },
  { field_id: 'box_coverage_m2', label_vi: 'Diện tích/hộp (m²)', description: 'm² per box', tier: 'T2', data_type: 'number', group: G.PACKAGING, example: '1.44', derived: true },
  { field_id: 'box_weight_kg', label_vi: 'Trọng lượng hộp (kg)', description: 'Box weight for logistics', tier: 'T0', data_type: 'number', group: G.PACKAGING, score_impact: 'light', example: '32.4' },
  { field_id: 'boxes_per_pallet', label_vi: 'Số hộp/pallet', description: 'Pallet logistics', tier: 'T3', data_type: 'number', group: G.PACKAGING, score_impact: 'light', example: '48' },

  // ── PERFORMANCE (type-specific) ──
  { field_id: 'slip_rating', label_vi: 'Chống trơn', description: 'Slip resistance', tier: 'T0', data_type: 'enum', group: G.PERFORMANCE, enum_values: ENUMS.slip_rating, score_impact: 'high', example: 'R10' },
  { field_id: 'pei_rating', label_vi: 'Chịu mài mòn PEI', description: 'PEI abrasion (ceramic only)', tier: 'T0', data_type: 'enum', group: G.PERFORMANCE, enum_values: ENUMS.pei_rating, score_impact: 'high', example: 'PEI-IV' },
  { field_id: 'water_absorption', label_vi: 'Hút nước (%)', description: 'Water absorption %', tier: 'T0', data_type: 'number', group: G.PERFORMANCE, score_impact: 'high', example: '0.1' },
  { field_id: 'ac_rating', label_vi: 'AC rating', description: 'Laminate/wood only', tier: 'T0', data_type: 'enum', group: G.PERFORMANCE, enum_values: ['AC1', 'AC2', 'AC3', 'AC4', 'AC5', 'AC6'], score_impact: 'high', example: 'AC4' },
  { field_id: 'fire_rating', label_vi: 'Chống cháy', description: 'Fire classification', tier: 'T0', data_type: 'enum', group: G.PERFORMANCE, enum_values: ['A1', 'A2', 'B', 'C', 'D', 'E', 'F'], score_impact: 'light', example: 'A1' },
  { field_id: 'voc_level', label_vi: 'VOC', description: 'VOC — required for paint', tier: 'T0', data_type: 'string', group: G.PERFORMANCE, score_impact: 'high', example: '< 50 g/L' },
  { field_id: 'coverage_m2_per_unit', label_vi: 'Độ phủ', description: 'Coverage (paint: m²/liter)', tier: 'T0', data_type: 'number', group: G.PERFORMANCE, score_impact: 'high', example: '12' },
  { field_id: 'warranty_years', label_vi: 'Bảo hành (năm)', description: 'Manufacturer warranty', tier: 'T0', data_type: 'number', group: G.PERFORMANCE, score_impact: 'light', example: '10' },
  { field_id: 'certification', label_vi: 'Chứng nhận', description: 'Certifications (badge)', tier: 'T3', data_type: 'string_array', group: G.PERFORMANCE, score_impact: 'high', example: '["ISO 9001:2015"]' },
  { field_id: 'installation_method', label_vi: 'Lắp đặt', description: 'Installation method', tier: 'T0', data_type: 'enum', group: G.PERFORMANCE, enum_values: ENUMS.installation_method, score_impact: 'light', example: 'mortar' },
  { field_id: 'recommended_joint_mm', label_vi: 'Khe mạch (mm)', description: 'Recommended grout joint', tier: 'T0', data_type: 'number', group: G.PERFORMANCE, score_impact: 'light', example: '2' },

  // ── COMMERCIAL ──
  { field_id: 'price_per_box', label_vi: 'Giá/hộp', description: 'Supplier original price', tier: 'T1', data_type: 'number', group: G.COMMERCIAL, score_impact: 'high', example: '285000' },
  { field_id: 'price_unit_original', label_vi: 'Đơn vị giá gốc', description: 'Original price unit', tier: 'T1', data_type: 'enum', group: G.COMMERCIAL, enum_values: ['hộp', 'lít', 'cuộn', 'tấm', 'm²', 'm_dài', 'viên', 'thùng'], example: 'hộp' },
  { field_id: 'price_value', label_vi: 'Giá/đơn vị chuẩn', description: 'Normalized to canonical unit', tier: 'T2', data_type: 'number', group: G.COMMERCIAL, example: '197917', derived: true },
  { field_id: 'price_unit', label_vi: 'Đơn vị giá chuẩn', description: 'From material_type definition', tier: 'T2', data_type: 'enum', group: G.COMMERCIAL, enum_values: ['m²', 'lít', 'cuộn'], example: 'm²', derived: true },
  { field_id: 'price_type', label_vi: 'Loại giá', description: 'fixed/quote/range', tier: 'T1', data_type: 'enum', group: G.COMMERCIAL, enum_values: ENUMS.price_type, example: 'fixed' },
  { field_id: 'price_min', label_vi: 'Giá min', description: 'Range minimum', tier: 'T1', data_type: 'number', group: G.COMMERCIAL, example: '250000' },
  { field_id: 'price_max', label_vi: 'Giá max', description: 'Range maximum', tier: 'T1', data_type: 'number', group: G.COMMERCIAL, example: '320000' },
  { field_id: 'currency', label_vi: 'Tiền tệ', description: 'ISO currency', tier: 'T1', data_type: 'enum', group: G.COMMERCIAL, enum_values: ENUMS.currency, example: 'VND' },
  { field_id: 'moq', label_vi: 'MOQ', description: 'Minimum order quantity', tier: 'T3', data_type: 'string', group: G.COMMERCIAL, score_impact: 'light', example: '50 m²' },
  { field_id: 'lead_time_days', label_vi: 'Thời gian giao', description: 'Lead time in days', tier: 'T3', data_type: 'number', group: G.COMMERCIAL, score_impact: 'light', example: '7' },
  { field_id: 'availability', label_vi: 'Tình trạng', description: 'Stock status', tier: 'T3', data_type: 'enum', group: G.COMMERCIAL, enum_values: ENUMS.availability, score_impact: 'high', example: 'in_stock' },

  // ── DIGITAL ASSETS ──
  { field_id: 'texture_diffuse', label_vi: 'Texture chính', description: 'Main surface texture — plugin requires', tier: 'T1', data_type: 'file', group: G.ASSETS, score_impact: 'high', example: '/assets/{id}/diffuse.jpg' },
  { field_id: 'product_image', label_vi: 'Ảnh sản phẩm', description: 'Product photo for catalog', tier: 'T1', data_type: 'file', group: G.ASSETS, score_impact: 'high', example: '/assets/{id}/photo.jpg' },
  { field_id: 'spec_sheet_pdf', label_vi: 'Spec sheet gốc', description: 'Original PDF for traceability', tier: 'T1', data_type: 'file', group: G.ASSETS, example: '/assets/{id}/specsheet.pdf' },
  { field_id: 'texture_normal', label_vi: 'Normal map', description: 'Surface bump detail', tier: 'T3', data_type: 'file', group: G.ASSETS, score_impact: 'high', example: '/assets/{id}/normal.png' },
  { field_id: 'texture_roughness', label_vi: 'Roughness map', description: 'Roughness map', tier: 'T3', data_type: 'file', group: G.ASSETS, score_impact: 'high', example: '/assets/{id}/roughness.png' },
  { field_id: 'texture_ao', label_vi: 'AO map', description: 'Ambient occlusion map', tier: 'T3', data_type: 'file', group: G.ASSETS, score_impact: 'light', example: '/assets/{id}/ao.png' },
  { field_id: 'product_image_room', label_vi: 'Ảnh in-situ', description: 'In-context room photo', tier: 'T3', data_type: 'file', group: G.ASSETS, score_impact: 'high', example: '/assets/{id}/photo_room.jpg' },

  // ── UV MAPPING ──
  { field_id: 'tile_repeat_x', label_vi: 'Lặp X (mm)', description: 'Texture repeat X (mm)', tier: 'T2', data_type: 'number', group: G.UV, example: '600', derived: true },
  { field_id: 'tile_repeat_y', label_vi: 'Lặp Y (mm)', description: 'Texture repeat Y (mm)', tier: 'T2', data_type: 'number', group: G.UV, example: '600', derived: true },
  { field_id: 'uv_rotation', label_vi: 'Góc xoay UV', description: 'UV rotation degrees', tier: 'T3', data_type: 'number', group: G.UV, score_impact: 'light', example: '0' },

  // ── PBR / APPEARANCE (glTF 2.0) ──
  { field_id: 'pbr_base_color', label_vi: 'Base color', description: 'Fallback hex color', tier: 'T2', data_type: 'hex_color', group: G.PBR, example: '#C8B8A0', derived: true },
  { field_id: 'pbr_metallic', label_vi: 'Metallic', description: '0=non-metal, 1=metal', tier: 'T2', data_type: 'number', group: G.PBR, example: '0.0', derived: true },
  { field_id: 'pbr_roughness', label_vi: 'Roughness', description: '0=mirror, 1=rough', tier: 'T2', data_type: 'number', group: G.PBR, example: '0.35', derived: true },
  { field_id: 'pbr_opacity', label_vi: 'Opacity', description: '0=transparent, 1=opaque', tier: 'T2', data_type: 'number', group: G.PBR, example: '1.0', derived: true },
  { field_id: 'pbr_ior', label_vi: 'IOR', description: 'Index of refraction', tier: 'T2', data_type: 'number', group: G.PBR, example: '1.5', derived: true },
  { field_id: 'pbr_bump_scale', label_vi: 'Bump intensity', description: 'Bump/normal intensity', tier: 'T2', data_type: 'number', group: G.PBR, example: '1.0', derived: true },

  // ── RENDER EXTENSIONS (Phase 2) ──
  { field_id: 'clearcoat_weight', label_vi: 'Clearcoat', description: 'KHR_materials_clearcoat', tier: 'T3', data_type: 'number', group: G.RENDER, score_impact: 'light', example: '0.0' },
  { field_id: 'sheen_weight', label_vi: 'Sheen', description: 'KHR_materials_sheen', tier: 'T3', data_type: 'number', group: G.RENDER, score_impact: 'light', example: '0.0' },
  { field_id: 'sss_weight', label_vi: 'Subsurface', description: 'Subsurface scattering', tier: 'T3', data_type: 'number', group: G.RENDER, score_impact: 'light', example: '0.0' },
  { field_id: 'transmission_weight', label_vi: 'Transmission', description: 'Light transmission', tier: 'T3', data_type: 'number', group: G.RENDER, score_impact: 'light', example: '0.0' },

  // ── BIM EXTENSIONS (Phase 2) ──
  { field_id: 'thermal_conductivity', label_vi: 'Dẫn nhiệt', description: 'W/m·K', tier: 'T3', data_type: 'number', group: G.BIM, score_impact: 'light', example: '1.3' },
  { field_id: 'density_kg_m3', label_vi: 'Khối lượng riêng', description: 'kg/m³', tier: 'T3', data_type: 'number', group: G.BIM, score_impact: 'light', example: '2300' },
  { field_id: 'sound_absorption_nrc', label_vi: 'NRC', description: 'Noise Reduction Coefficient', tier: 'T3', data_type: 'number', group: G.BIM, score_impact: 'light', example: '0.85' },
  { field_id: 'u_value', label_vi: 'Hệ số U', description: 'W/m²·K (glass)', tier: 'T3', data_type: 'number', group: G.BIM, score_impact: 'light', example: '1.1' },
  { field_id: 'embodied_carbon', label_vi: 'Carbon ẩn', description: 'kg CO₂e/kg', tier: 'T3', data_type: 'number', group: G.BIM, score_impact: 'light', example: '' },

  // ── SYSTEM / AUDIT ──
  { field_id: 'created_at', label_vi: 'Ngày tạo', description: 'Auto timestamp', tier: 'SYS', data_type: 'datetime', group: G.SYSTEM, example: '2026-08-01T14:30:00Z' },
  { field_id: 'updated_at', label_vi: 'Cập nhật cuối', description: 'Auto timestamp', tier: 'SYS', data_type: 'datetime', group: G.SYSTEM },
  { field_id: 'created_by', label_vi: 'Người tạo', description: 'Supplier ID / system', tier: 'SYS', data_type: 'string', group: G.SYSTEM, example: 'SUP-VIGLACERA' },
  { field_id: 'version', label_vi: 'Phiên bản', description: 'Incremented on each edit', tier: 'SYS', data_type: 'integer', group: G.SYSTEM, example: '3' },
  { field_id: 'completeness_score', label_vi: 'Điểm SKU (%)', description: 'Core metric — controls visibility & ranking', tier: 'SYS', data_type: 'number', group: G.SYSTEM, example: '92' },
  { field_id: 'source_type', label_vi: 'Nguồn data', description: 'Data origin', tier: 'SYS', data_type: 'enum', group: G.SYSTEM, enum_values: ENUMS.source_type, example: 'pdf_extract' },
  { field_id: 'review_status', label_vi: 'Trạng thái review', description: 'Review status', tier: 'SYS', data_type: 'enum', group: G.SYSTEM, enum_values: ENUMS.review_status, example: 'auto_approved' },
  { field_id: 'raw_extraction_id', label_vi: 'FK raw data', description: 'Link to staging', tier: 'SYS', data_type: 'string', group: G.SYSTEM, example: 'RAW-001' },
] as const;

/** Lookup map */
export const FIELD_MAP: Readonly<Record<string, CanonicalField>> = Object.fromEntries(
  CANONICAL_FIELDS.map((f) => [f.field_id, f]),
);

export function getField(field_id: string): CanonicalField {
  const f = FIELD_MAP[field_id];
  if (!f) throw new Error(`Unknown canonical field: "${field_id}"`);
  return f;
}
