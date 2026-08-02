/**
 * SpecIt — Material Type Registry
 * Source: Canonical Schema v3, Sheet 01 (Material_Types)
 *
 * This is the platform's registry — the immutable list of supported material types.
 * Adding a new material type = data change (INSERT), NOT a code change.
 * Each type defines its own field set (see type-field-matrix.ts).
 */

export interface MaterialTypeDefinition {
  /** Registry ID — immutable, used as FK everywhere */
  material_type_id: string;
  /** Vietnamese display name */
  name_vi: string;
  /** English display name */
  name_en: string;
  /** Where this material can be applied */
  application: MaterialApplication[];
  /** Where this material can be installed */
  location: MaterialLocation[];
  /** Physical form factor */
  form_factor: string;
  /** Canonical pricing unit — prices are normalized to this */
  price_unit: string;
  /** MVP priority: ★★★ = MVP #1, ★★ = MVP #2, ★ = later, empty = post-MVP */
  mvp_priority: string;
  /** Notes */
  notes?: string;
}

export type MaterialApplication =
  | 'flooring'
  | 'wall'
  | 'ceiling'
  | 'countertop'
  | 'facade'
  | 'partition'
  | 'upholstery';

export type MaterialLocation = 'indoor' | 'outdoor' | 'wet_area';

/** Registry — derived from Sheet 01 */
export const MATERIAL_TYPES: readonly MaterialTypeDefinition[] = [
  {
    material_type_id: 'ceramic_tile',
    name_vi: 'Gạch ceramic/porcelain',
    name_en: 'Ceramic/Porcelain Tile',
    application: ['flooring', 'wall'],
    location: ['indoor', 'outdoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '★★★',
    notes: 'MVP #1',
  },
  {
    material_type_id: 'natural_stone_tile',
    name_vi: 'Đá tự nhiên tấm cắt',
    name_en: 'Natural Stone Tile',
    application: ['flooring', 'wall', 'countertop'],
    location: ['indoor', 'outdoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '★★',
  },
  {
    material_type_id: 'engineered_wood',
    name_vi: 'Sàn gỗ công nghiệp',
    name_en: 'Engineered Wood',
    application: ['flooring'],
    location: ['indoor'],
    form_factor: 'Thanh/tấm',
    price_unit: 'm²',
    mvp_priority: '★★',
  },
  {
    material_type_id: 'vinyl_spc',
    name_vi: 'Sàn nhựa/SPC/LVT',
    name_en: 'Vinyl/SPC/LVT',
    application: ['flooring'],
    location: ['indoor'],
    form_factor: 'Thanh/tấm',
    price_unit: 'm²',
    mvp_priority: '★',
  },
  {
    material_type_id: 'paint',
    name_vi: 'Sơn',
    name_en: 'Paint',
    application: ['wall', 'ceiling'],
    location: ['indoor', 'outdoor'],
    form_factor: 'Lỏng',
    price_unit: 'lít',
    mvp_priority: '★★★',
    notes: 'MVP #2 — validate registry',
  },
  {
    material_type_id: 'wallpaper',
    name_vi: 'Giấy dán tường',
    name_en: 'Wallpaper',
    application: ['wall'],
    location: ['indoor'],
    form_factor: 'Cuộn',
    price_unit: 'cuộn(m²)',
    mvp_priority: '★',
  },
  {
    material_type_id: 'wall_panel',
    name_vi: 'Tấm ốp tường',
    name_en: 'Wall Panel',
    application: ['wall', 'ceiling'],
    location: ['indoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '★★',
  },
  {
    material_type_id: 'ceiling_tile',
    name_vi: 'Tấm trần',
    name_en: 'Ceiling Tile',
    application: ['ceiling'],
    location: ['indoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '★',
  },
  {
    material_type_id: 'quartz_surface',
    name_vi: 'Đá nhân tạo',
    name_en: 'Engineered Quartz',
    application: ['countertop', 'wall'],
    location: ['indoor'],
    form_factor: 'Tấm',
    price_unit: 'm dài/m²',
    mvp_priority: '★',
  },
  {
    material_type_id: 'solid_surface',
    name_vi: 'Bề mặt liền khối',
    name_en: 'Solid Surface/HPL',
    application: ['countertop', 'wall'],
    location: ['indoor'],
    form_factor: 'Tấm',
    price_unit: 'm dài/m²',
    mvp_priority: '★',
  },
  {
    material_type_id: 'facade_panel',
    name_vi: 'Tấm ốp ngoài',
    name_en: 'Facade Panel',
    application: ['facade'],
    location: ['outdoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '',
    notes: 'Post-MVP',
  },
  {
    material_type_id: 'glass',
    name_vi: 'Kính',
    name_en: 'Glass',
    application: ['facade', 'partition'],
    location: ['indoor', 'outdoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '',
  },
  {
    material_type_id: 'fabric_leather',
    name_vi: 'Vải/Da',
    name_en: 'Fabric/Leather',
    application: ['wall', 'upholstery'],
    location: ['indoor'],
    form_factor: 'Cuộn/tấm',
    price_unit: 'm²/yard',
    mvp_priority: '',
  },
  {
    material_type_id: 'acoustic_panel',
    name_vi: 'Tấm cách âm',
    name_en: 'Acoustic Panel',
    application: ['wall', 'ceiling'],
    location: ['indoor'],
    form_factor: 'Tấm',
    price_unit: 'm²',
    mvp_priority: '',
  },
  {
    material_type_id: 'membrane',
    name_vi: 'Tấm chống thấm',
    name_en: 'Waterproofing',
    application: ['flooring', 'wall'],
    location: ['indoor', 'outdoor'],
    form_factor: 'Cuộn',
    price_unit: 'm²',
    mvp_priority: '',
    notes: 'Technical',
  },
] as const;

/** Lookup map for O(1) access */
export const MATERIAL_TYPE_MAP: Readonly<Record<string, MaterialTypeDefinition>> =
  Object.fromEntries(MATERIAL_TYPES.map((t) => [t.material_type_id, t]));

/** Type guard */
export function isValidMaterialType(id: string): id is MaterialTypeDefinition['material_type_id'] {
  return id in MATERIAL_TYPE_MAP;
}

/** Get a material type definition or throw */
export function getMaterialType(id: string): MaterialTypeDefinition {
  const def = MATERIAL_TYPE_MAP[id];
  if (!def) throw new Error(`Unknown material_type: "${id}"`);
  return def;
}
