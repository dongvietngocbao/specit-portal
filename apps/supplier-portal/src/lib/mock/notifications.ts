export interface NotificationItem {
  id: string;
  type: 'demand' | 'completeness' | 'review' | 'system' | 'dealer';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_url?: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    type: 'demand',
    title: 'Demand Signal tăng 23%',
    message: 'SKU "Viglacera Platinum TS6-620" được spec 47 lần — đang hot! Thêm style_tags để tăng match.',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    action_url: '/demand-signals',
  },
  {
    id: 'NOTIF-002',
    type: 'completeness',
    title: '3 SKU cần bổ sung data',
    message: 'Mosaic Hex VG-3030, Cement Grey VG-CG45, và Subway White VG-SW120 đang ở trạng thái partial/draft.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
    action_url: '/skus?status=partial',
  },
  {
    id: 'NOTIF-003',
    type: 'review',
    title: 'SKU Carrara White đạt ★★ Premium',
    message: 'Chúc mừng! Viglacera Carrara White VG-CW60 đạt 95% completeness — Premium badge.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: true,
    action_url: '/skus/550e8400-e29b-41d4-a716-446655440006',
  },
  {
    id: 'NOTIF-004',
    type: 'dealer',
    title: 'Đại lý PrimeTiles quan tâm',
    message: 'Đại lý PrimeTiles (HN) đã xem giá 5 SKU của bạn trong 7 ngày qua.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    action_url: '/dealers',
  },
  {
    id: 'NOTIF-005',
    type: 'system',
    title: 'AI Extraction hoàn tất',
    message: '3 SKU mới đã được extract từ file "viglacera_catalog_q3_2026.pdf". Review ngay.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    action_url: '/upload',
  },
];
