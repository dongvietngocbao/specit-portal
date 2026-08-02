export interface DemandSignalItem {
  sku_id: string;
  product_name: string;
  spec_count: number;
  spec_count_change: number; // % vs last period
  top_regions: { region: string; count: number }[];
  top_applications: { application: string; count: number }[];
  trend: 'up' | 'down' | 'stable';
  suggested_action: string;
  score_gap: number; // how much score could improve
}

export const MOCK_DEMAND_SIGNALS: DemandSignalItem[] = [
  {
    sku_id: 'SPT-CER-VG6060-001',
    product_name: 'Viglacera Platinum TS6-620',
    spec_count: 47,
    spec_count_change: 23,
    top_regions: [{ region: 'TP.HCM', count: 22 }, { region: 'Hà Nội', count: 15 }, { region: 'Đà Nẵng', count: 10 }],
    top_applications: [{ application: 'Living Room', count: 28 }, { application: 'Bedroom', count: 12 }, { application: 'Kitchen', count: 7 }],
    trend: 'up',
    suggested_action: 'Thêm style_tags "luxury" để tăng match với KTS cao cấp',
    score_gap: 8,
  },
  {
    sku_id: 'SPT-CER-VG8080-002',
    product_name: 'Viglacera Onyx VG-8080 Nero',
    spec_count: 32,
    spec_count_change: 15,
    top_regions: [{ region: 'TP.HCM', count: 18 }, { region: 'Hà Nội', count: 14 }],
    top_applications: [{ application: 'Bathroom', count: 20 }, { application: 'Kitchen', count: 12 }],
    trend: 'up',
    suggested_action: 'Upload normal map + roughness map để đạt ★★ Premium',
    score_gap: 12,
  },
  {
    sku_id: 'SPT-CER-VG6060-006',
    product_name: 'Viglacera Carrara White VG-CW60',
    spec_count: 41,
    spec_count_change: 8,
    top_regions: [{ region: 'Hà Nội', count: 20 }, { region: 'TP.HCM', count: 15 }, { region: 'Cần Thơ', count: 6 }],
    top_applications: [{ application: 'Bathroom', count: 25 }, { application: 'Living Room', count: 16 }],
    trend: 'stable',
    suggested_action: 'SKU đã ★★ Premium — duy trì chất lượng',
    score_gap: 5,
  },
  {
    sku_id: 'SPT-CER-VG3030-003',
    product_name: 'Viglacera Mosaic Hex VG-3030',
    spec_count: 8,
    spec_count_change: -12,
    top_regions: [{ region: 'Đà Nẵng', count: 5 }, { region: 'TP.HCM', count: 3 }],
    top_applications: [{ application: 'Bathroom', count: 8 }],
    trend: 'down',
    suggested_action: 'Bổ sung finish, PEI rating, texture_diffuse — đang ở 58% (partial)',
    score_gap: 35,
  },
  {
    sku_id: 'SPT-CER-VG4545-007',
    product_name: 'Viglacera Cement Grey VG-CG45',
    spec_count: 5,
    spec_count_change: 0,
    top_regions: [{ region: 'Hà Nội', count: 3 }, { region: 'Hải Phòng', count: 2 }],
    top_applications: [{ application: 'Garage', count: 3 }, { application: 'Commercial', count: 2 }],
    trend: 'stable',
    suggested_action: 'Thêm space_type, style_tags — đang ở 52% (partial)',
    score_gap: 30,
  },
];
