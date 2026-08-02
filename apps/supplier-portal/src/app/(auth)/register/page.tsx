'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const accountTypes = [
  { value: 'manufacturer', label: 'Nhà sản xuất', desc: 'Sản xuất VLXD trực tiếp' },
  { value: 'distributor', label: 'Nhà phân phối', desc: 'Phân phối cấp 1' },
  { value: 'dealer', label: 'Đại lý / Trading', desc: 'Bán lẻ / thương mại' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('manufacturer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Tài khoản đã tạo. Chào mừng đến SpecIt!');
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <AuthLayout>
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
          <CardDescription>Bắt đầu quản lý SKU trên SpecIt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account type selector */}
            <div className="space-y-2">
              <Label>Loại tài khoản</Label>
              <div className="grid grid-cols-1 gap-2">
                {accountTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAccountType(type.value)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                      accountType === type.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="company">Công ty</Label>
                <Input id="company" placeholder="Viglacera Corp" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Mã số thuế</Label>
                <Input id="tax" placeholder="0101010101" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contact@company.vn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" placeholder="Tối thiểu 8 ký tự" minLength={8} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
