export interface Dealer {
  id: string;
  name: string;
  type: 'distributor' | 'dealer' | 'trading';
  region: string;
  contact_person: string;
  email: string;
  phone: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  sku_count: number;
  status: 'active' | 'pending' | 'inactive';
  last_order: string;
  total_volume_m2: number;
}

export const MOCK_DEALERS: Dealer[] = [
  { id: 'DLR-001', name: 'PrimeTiles Hanoi', type: 'distributor', region: 'Hà Nội', contact_person: 'Trần Quang Minh', email: 'minh@primetiles.vn', phone: '0901234567', tier: 'tier_1', sku_count: 8, status: 'active', last_order: '2026-07-28', total_volume_m2: 12500 },
  { id: 'DLR-002', name: 'Vật Liệu Xây Dựng Sài Gòn', type: 'distributor', region: 'TP.HCM', contact_person: 'Lê Hoàng Nam', email: 'nam@vldsg.vn', phone: '0907654321', tier: 'tier_1', sku_count: 10, status: 'active', last_order: '2026-07-30', total_volume_m2: 18900 },
  { id: 'DLR-003', name: 'Gạch Đẹp Đà Nẵng', type: 'dealer', region: 'Đà Nẵng', contact_person: 'Phạm Thị Lan', email: 'lan@gachdepdanang.vn', phone: '0912345678', tier: 'tier_2', sku_count: 5, status: 'active', last_order: '2026-07-25', total_volume_m2: 4200 },
  { id: 'DLR-004', name: 'Cần Thơ Building Supply', type: 'dealer', region: 'Cần Thơ', contact_person: 'Võ Thanh Tùng', email: 'tung@ctbs.vn', phone: '0923456789', tier: 'tier_2', sku_count: 3, status: 'pending', last_order: '2026-06-15', total_volume_m2: 1500 },
  { id: 'DLR-005', name: 'Hải Phòng Materials Co.', type: 'trading', region: 'Hải Phòng', contact_person: 'Đặng Văn Hùng', email: 'hung@hpmat.vn', phone: '0934567890', tier: 'tier_3', sku_count: 2, status: 'active', last_order: '2026-07-20', total_volume_m2: 800 },
];

export interface DealerPriceEntry {
  dealer_id: string;
  dealer_name: string;
  sku_id: string;
  sku_name: string;
  dealer_price: number; // price per m²
  list_price: number; // your list price
  discount_percent: number;
  last_updated: string;
}

export const MOCK_DEALER_PRICES: DealerPriceEntry[] = [
  { dealer_id: 'DLR-001', dealer_name: 'PrimeTiles Hanoi', sku_id: 'SPT-CER-VG6060-001', sku_name: 'Viglacera Platinum TS6-620', dealer_price: 178125, list_price: 197917, discount_percent: 10, last_updated: '2026-07-28' },
  { dealer_id: 'DLR-002', dealer_name: 'Vật Liệu XD Sài Gòn', sku_id: 'SPT-CER-VG6060-001', sku_name: 'Viglacera Platinum TS6-620', dealer_price: 168239, list_price: 197917, discount_percent: 15, last_updated: '2026-07-30' },
  { dealer_id: 'DLR-001', dealer_name: 'PrimeTiles Hanoi', sku_id: 'SPT-CER-VG8080-002', sku_name: 'Viglacera Onyx VG-8080 Nero', dealer_price: 365625, list_price: 406250, discount_percent: 10, last_updated: '2026-07-28' },
  { dealer_id: 'DLR-002', dealer_name: 'Vật Liệu XD Sài Gòn', sku_id: 'SPT-CER-VG6060-006', sku_name: 'Viglacera Carrara White VG-CW60', dealer_price: 262500, list_price: 291667, discount_percent: 10, last_updated: '2026-07-30' },
  { dealer_id: 'DLR-003', dealer_name: 'Gạch Đẹp Đà Nẵng', sku_id: 'SPT-CER-VG6060-001', sku_name: 'Viglacera Platinum TS6-620', dealer_price: 188000, list_price: 197917, discount_percent: 5, last_updated: '2026-07-25' },
];
