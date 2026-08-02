import type { Supplier } from '@specit/canonical-schema';

export const MOCK_SUPPLIER: Supplier = {
  supplier_id: 'SUP-VIGLACERA',
  name: 'Viglacera Corporation',
  brand: 'Viglacera',
  email: 'contact@viglacera.vn',
  created_at: '2026-07-15T08:00:00Z',
};

export const MOCK_CURRENT_USER = {
  id: 'USR-001',
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@viglacera.vn',
  avatar_url: null,
  role: 'admin' as const,
  supplier_id: 'SUP-VIGLACERA',
};

export const MOCK_WORKSPACE = {
  id: 'WS-001',
  name: 'Viglacera Corporation',
  slug: 'viglacera',
  plan: 'enterprise' as const,
  supplier_id: 'SUP-VIGLACERA',
  verified: true,
  tier: 'tier_1' as const, // Verified manufacturer
};
