import {
  LayoutDashboard, Package, Upload, Image, CheckCircle2, BarChart3,
  TrendingUp, Store, Bell, Settings, type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Sản phẩm',
    items: [
      { label: 'SKU Management', href: '/skus', icon: Package, badge: '12' },
      { label: 'Upload Center', href: '/upload', icon: Upload },
      { label: 'Media Library', href: '/media', icon: Image },
    ],
  },
  {
    title: 'Chất lượng',
    items: [
      { label: 'Validation', href: '/validation', icon: CheckCircle2 },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Thị trường',
    items: [
      { label: 'Demand Signals', href: '/demand-signals', icon: TrendingUp, badge: '2' },
      { label: 'Dealer Network', href: '/dealers', icon: Store },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { label: 'Notifications', href: '/notifications', icon: Bell, badge: '2' },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];
