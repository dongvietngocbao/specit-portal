export interface DashboardKPI {
  label: string;
  value: number;
  change: number; // % change
  format: 'number' | 'currency' | 'percent';
  icon: string;
}

export const MOCK_DASHBOARD_KPIS: DashboardKPI[] = [
  { label: 'Tổng SKU', value: 12, change: 3, format: 'number', icon: 'package' },
  { label: 'SKU Active', value: 8, change: 2, format: 'number', icon: 'check-circle' },
  { label: 'Điểm TB hoàn thiện', value: 72, change: 5, format: 'percent', icon: 'trending-up' },
  { label: 'Lượt spec tháng này', value: 238, change: 18, format: 'number', icon: 'eye' },
];

export interface SpecTrendData {
  month: string;
  specs: number;
  new_skus: number;
}

export const MOCK_SPEC_TREND: SpecTrendData[] = [
  { month: 'T2', specs: 95, new_skus: 2 },
  { month: 'T3', specs: 120, new_skus: 3 },
  { month: 'T4', specs: 145, new_skus: 1 },
  { month: 'T5', specs: 165, new_skus: 2 },
  { month: 'T6', specs: 180, new_skus: 4 },
  { month: 'T7', specs: 198, new_skus: 3 },
  { month: 'T8', specs: 238, new_skus: 3 },
];

export interface ScoreDistribution {
  band: string;
  count: number;
  color: string;
  label: string;
}

export const MOCK_SCORE_DISTRIBUTION: ScoreDistribution[] = [
  { band: '90-100', count: 1, color: '#8B5CF6', label: '★★ Premium' },
  { band: '80-89', count: 4, color: '#6366F1', label: '★ Verified' },
  { band: '65-79', count: 2, color: '#3B82F6', label: 'Active' },
  { band: '41-64', count: 3, color: '#F59E0B', label: 'Partial' },
  { band: '0-40', count: 1, color: '#EF4444', label: 'Draft' },
  { band: '1', count: 1, color: '#6B7280', label: 'Discontinued' },
];

export interface TopRegionData {
  region: string;
  spec_count: number;
  growth: number;
}

export const MOCK_TOP_REGIONS: TopRegionData[] = [
  { region: 'TP.HCM', spec_count: 108, growth: 22 },
  { region: 'Hà Nội', spec_count: 76, growth: 15 },
  { region: 'Đà Nẵng', spec_count: 28, growth: 8 },
  { region: 'Cần Thơ', spec_count: 14, growth: -3 },
  { region: 'Hải Phòng', spec_count: 12, growth: 5 },
];

export interface CollectionPerformance {
  collection: string;
  sku_count: number;
  avg_score: number;
  total_specs: number;
}

export const MOCK_COLLECTION_PERFORMANCE: CollectionPerformance[] = [
  { collection: 'Marble Elite 2026', sku_count: 2, avg_score: 93, total_specs: 88 },
  { collection: 'Onyx Black Series', sku_count: 1, avg_score: 88, total_specs: 32 },
  { collection: 'Jewel Tone Collection', sku_count: 1, avg_score: 86, total_specs: 12 },
  { collection: 'Natural Stone Look', sku_count: 1, avg_score: 84, total_specs: 16 },
  { collection: 'Wood Impression', sku_count: 1, avg_score: 82, total_specs: 28 },
  { collection: 'Terrazzo Revival', sku_count: 1, avg_score: 76, total_specs: 19 },
  { collection: 'Sand Dune Series', sku_count: 1, avg_score: 80, total_specs: 23 },
];
