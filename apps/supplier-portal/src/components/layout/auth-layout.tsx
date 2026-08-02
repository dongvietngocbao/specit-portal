import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:flex-1 bg-sidebar flex-col justify-between p-12">
        <Logo />
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Vertical SaaS cho <br />
            <span className="gradient-text">nhà cung cấp VLXD</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Upload catalog → AI extract → SKU chuẩn hoá → KTS spec.
            Đơn giản hoá toàn bộ quy trình chỉ trong một nền tảng.
          </p>
          <div className="flex gap-6 pt-4">
            <div>
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm text-muted-foreground">SKU capacity</div>
            </div>
            <div>
              <div className="text-2xl font-bold">16</div>
              <div className="text-sm text-muted-foreground">Material types</div>
            </div>
            <div>
              <div className="text-2xl font-bold">80+</div>
              <div className="text-sm text-muted-foreground">Canonical fields</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 SpecIt. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
