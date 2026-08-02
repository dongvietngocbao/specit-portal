import type { MaterialDraft, ExtractionResult } from '@specit/canonical-schema';

export const MOCK_EXTRACTION_RESULT: ExtractionResult = {
  raw_extraction_id: 'RAW-2026-0802',
  extraction_confidence: 87,
  drafts: [
    {
      material_type: 'ceramic_tile',
      fields: {
        product_name: { value: 'Viglacera Royal Gold VG-RG80', confidence: 0.95, source_text: 'Gạch Porcelain Viglacera Royal Gold VG-RG80 80x80' },
        brand: { value: 'Viglacera', confidence: 0.99, source_text: 'Viglacera Corporation' },
        model_number: { value: 'VG-RG80', confidence: 0.97, source_text: 'Model: VG-RG80' },
        collection_name: { value: 'Royal Collection 2026', confidence: 0.88, source_text: 'BST Royal Collection 2026' },
        width_mm: { value: 800, confidence: 0.99, source_text: 'Kích thước: 800x800mm' },
        height_mm: { value: 800, confidence: 0.99, source_text: 'Kích thước: 800x800mm' },
        thickness_mm: { value: 10, confidence: 0.92, source_text: 'Độ dày: 10mm' },
        finish: { value: 'polished', confidence: 0.85, source_text: 'Bề mặt: Polished' },
        slip_rating: { value: 'R10', confidence: 0.90, source_text: 'Chống trơn: R10' },
        pei_rating: { value: 'PEI-IV', confidence: 0.88, source_text: 'PEI: IV' },
        water_absorption: { value: 0.1, confidence: 0.95, source_text: 'Hút nước: ≤ 0.1%' },
        pieces_per_box: { value: 2, confidence: 0.97, source_text: 'Quy cách: 2 viên/hộp' },
        price_per_box: { value: 580000, confidence: 0.93, source_text: 'Giá: 580,000đ/hộp' },
        country_of_origin: { value: 'VN', confidence: 0.99, source_text: 'Xuất xứ: Việt Nam' },
      },
    },
    {
      material_type: 'ceramic_tile',
      fields: {
        product_name: { value: 'Viglacera Ocean Blue VG-OB60', confidence: 0.93, source_text: 'Gạch Porcelain Viglacera Ocean Blue VG-OB60 60x60' },
        brand: { value: 'Viglacera', confidence: 0.99, source_text: 'Viglacera Corporation' },
        model_number: { value: 'VG-OB60', confidence: 0.96, source_text: 'Model: VG-OB60' },
        collection_name: { value: 'Ocean Series', confidence: 0.82, source_text: 'BST Ocean Series' },
        width_mm: { value: 600, confidence: 0.99, source_text: 'Kích thước: 600x600mm' },
        height_mm: { value: 600, confidence: 0.99, source_text: 'Kích thước: 600x600mm' },
        thickness_mm: { value: 10, confidence: 0.91, source_text: 'Độ dày: 10mm' },
        finish: { value: 'matte', confidence: 0.87, source_text: 'Bề mặt: Matt' },
        slip_rating: { value: 'R11', confidence: 0.89, source_text: 'Chống trơn: R11' },
        pieces_per_box: { value: 4, confidence: 0.97, source_text: 'Quy cách: 4 viên/hộp' },
        price_per_box: { value: 320000, confidence: 0.92, source_text: 'Giá: 320,000đ/hộp' },
        country_of_origin: { value: 'VN', confidence: 0.99, source_text: 'Xuất xứ: Việt Nam' },
      },
    },
  ],
};
