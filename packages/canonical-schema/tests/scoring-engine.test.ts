/**
 * Canonical Schema — Integration Verification
 * Proves the completeness scoring engine works against the
 * Viglacera reference data from the spec template.
 */
import { calculateCompleteness, MATERIAL_TYPES, getFieldApplicability, isValidMaterialType } from '../src/index.js';

let pass = 0;
let fail = 0;
function assert(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    pass++;
  } else {
    console.log(`  ❌ ${name} ${detail ? '— ' + detail : ''}`);
    fail++;
  }
}

console.log('\n═══ TEST 1: Viglacera Reference Tile ═══');
{
  const tile = {
    product_name: 'Viglacera Platinum TS6-620',
    material_type: 'ceramic_tile',
    supplier_id: 'SUP-VIGLACERA',
    brand: 'Viglacera',
    model_number: 'TS6-620',
    collection_name: 'Marble Elite 2026',
    country_of_origin: 'VN',
    application: ['flooring', 'wall'],
    location: ['indoor'],
    color_family: 'warm_grey',
    finish: 'lappato',
    width_mm: 600, height_mm: 600, thickness_mm: 10,
    edge_type: 'rectified',
    pieces_per_box: 4,
    price_per_box: 285000, price_unit_original: 'hộp', currency: 'VND',
    slip_rating: 'R10', pei_rating: 'PEI-IV', water_absorption: 0.1,
    fire_rating: 'A1', warranty_years: 10,
    texture_diffuse: 'diffuse.jpg', product_image: 'photo.jpg',
    tile_repeat_x: 600,
  };
  const r = calculateCompleteness('ceramic_tile', tile);
  assert('Score is 70-80 range', r.score >= 70 && r.score <= 80, `got ${r.score}`);
  assert('Status is active', r.status === 'active', `got ${r.status}`);
  assert('Visible to architects', r.visible === true);
  assert('No badge (below 80%)', r.badge === undefined);
  assert('Has gaps array', Array.isArray(r.gaps) && r.gaps.length > 0);
  assert('Required gaps sorted first', r.gaps[0].weight >= r.gaps[r.gaps.length - 1].weight);
}

console.log('\n═══ TEST 2: Empty Draft SKU ═══');
{
  const r = calculateCompleteness('ceramic_tile', {
    product_name: 'Test',
    material_type: 'ceramic_tile',
    supplier_id: 'X',
  });
  assert('Score below 40', r.score < 40, `got ${r.score}`);
  assert('Status is draft', r.status === 'draft');
  assert('Not visible', r.visible === false);
}

console.log('\n═══ TEST 3: Fully Populated Premium SKU ═══');
{
  const full: Record<string, unknown> = {};
  // Fill every applicable field for ceramic_tile
  const fields = [
    'product_name', 'material_type', 'supplier_id', 'brand', 'model_number',
    'collection_name', 'country_of_origin', 'supplier_color_name',
    'application', 'location', 'color_family', 'color_hex', 'tone', 'pattern',
    'finish', 'style_tags', 'space_type',
    'width_mm', 'height_mm', 'thickness_mm', 'weight_kg_m2', 'edge_type',
    'pieces_per_box', 'box_weight_kg', 'boxes_per_pallet',
    'slip_rating', 'pei_rating', 'water_absorption', 'fire_rating',
    'warranty_years', 'certification', 'installation_method', 'recommended_joint_mm',
    'price_per_box', 'price_unit_original', 'price_type', 'currency',
    'moq', 'lead_time_days', 'availability',
    'texture_diffuse', 'product_image', 'texture_normal', 'texture_roughness',
    'texture_ao', 'product_image_room',
    'tile_repeat_x', 'uv_rotation',
  ];
  for (const f of fields) full[f] = 'filled';
  const r = calculateCompleteness('ceramic_tile', full);
  assert('Score >= 85', r.score >= 85, `got ${r.score}`);
  assert('Status is active', r.status === 'active');
  assert('Has badge (verified or premium)', r.badge !== undefined, `got ${r.badge}`);
}

console.log('\n═══ TEST 4: Material Type Registry ═══');
{
  assert('15+ material types', MATERIAL_TYPES.length >= 15, `got ${MATERIAL_TYPES.length}`);
  assert('ceramic_tile is valid', isValidMaterialType('ceramic_tile'));
  assert('paint is valid', isValidMaterialType('paint'));
  assert('invalid type rejected', !isValidMaterialType('foobar'));
}

console.log('\n═══ TEST 5: Type × Field Matrix ═══');
{
  // Ceramic tile requires slip_rating, paint does not
  assert('Tile requires slip_rating', getFieldApplicability('ceramic_tile', 'slip_rating') === 'required');
  assert('Paint excludes slip_rating', getFieldApplicability('paint', 'slip_rating') === 'n_a');
  // PEI is ceramic-only
  assert('Tile requires pei_rating', getFieldApplicability('ceramic_tile', 'pei_rating') === 'required');
  assert('Wood excludes pei_rating', getFieldApplicability('engineered_wood', 'pei_rating') === 'n_a');
  // VOC is paint-required
  assert('Paint requires voc_level', getFieldApplicability('paint', 'voc_level') === 'required');
  assert('Tile excludes voc_level', getFieldApplicability('ceramic_tile', 'voc_level') === 'n_a');
}

console.log(`\n════════════════════════════════════════`);
console.log(`  RESULTS: ${pass} passed, ${fail} failed`);
console.log(`════════════════════════════════════════`);
process.exit(fail > 0 ? 1 : 0);
