import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User, Building2, Users, Bell, Shield, Globe, Key,
  Mail, Phone, Save, Plus, Trash2, CheckCircle2,
} from 'lucide-react';
import { MOCK_CURRENT_USER, MOCK_WORKSPACE } from '@/lib/mock/suppliers';
import { initials } from '@/lib/utils';

const teamMembers = [
  { name: 'Nguyễn Văn An', email: 'an.nguyen@viglacera.vn', role: 'Admin', status: 'active' },
  { name: 'Trần Thị Bình', email: 'binh.tran@viglacera.vn', role: 'Editor', status: 'active' },
  { name: 'Lê Hoàng Phong', email: 'phong.le@viglacera.vn', role: 'Viewer', status: 'pending' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý tài khoản, workspace và team</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
          <TabsTrigger value="workspace"><Building2 className="h-4 w-4 mr-1" /> Workspace</TabsTrigger>
          <TabsTrigger value="team"><Users className="h-4 w-4 mr-1" /> Team</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-1" /> Security</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Hồ sơ cá nhân</CardTitle><CardDescription>Thông tin hiển thị trong Supplier Portal</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">{initials(MOCK_CURRENT_USER.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" size="sm">Upload Avatar</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG. Max 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ tên</Label>
                  <Input defaultValue={MOCK_CURRENT_USER.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={MOCK_CURRENT_USER.email} />
                </div>
                <div className="space-y-2">
                  <Label>SĐT</Label>
                  <Input placeholder="+84..." />
                </div>
                <div className="space-y-2">
                  <Label>Chức danh</Label>
                  <Input defaultValue="Product Manager" />
                </div>
              </div>
              <Button><Save className="h-4 w-4" /> Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspace */}
        <TabsContent value="workspace" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Workspace</CardTitle><CardDescription>Thông tin công ty trên SpecIt</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">VG</div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {MOCK_WORKSPACE.name}
                    <Badge className="bg-[hsl(142_71%_90%)] text-[hsl(142_71%_40%)] dark:bg-[hsl(142_71%_15%)] dark:text-[hsl(142_71%_65%)] gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Tier 1 · {MOCK_WORKSPACE.plan}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tên công ty</Label><Input defaultValue="Viglacera Corporation" /></div>
                <div className="space-y-2"><Label>Brand</Label><Input defaultValue="Viglacera" /></div>
                <div className="space-y-2"><Label>Mã số thuế</Label><Input defaultValue="0101010101" /></div>
                <div className="space-y-2"><Label>Website</Label><Input defaultValue="https://viglacera.vn" /></div>
                <div className="space-y-2"><Label>Email liên hệ</Label><Input defaultValue="contact@viglacera.vn" /></div>
                <div className="space-y-2"><Label>SĐT</Label><Input defaultValue="+84 24 3859 3333" /></div>
              </div>
              <Button><Save className="h-4 w-4" /> Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div><CardTitle>Thành viên Team</CardTitle><CardDescription>{teamMembers.length} thành viên</CardDescription></div>
              <Button size="sm"><Plus className="h-4 w-4" /> Mời thành viên</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.email} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{initials(member.name)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                    <Badge variant={member.role === 'Admin' ? 'default' : member.role === 'Editor' ? 'secondary' : 'outline'}>{member.role}</Badge>
                    <Badge variant={member.status === 'active' ? 'success' : 'warning'}>{member.status}</Badge>
                    <Button variant="ghost" size="icon-sm"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Tùy chọn thông báo</CardTitle><CardDescription>Chọn loại thông báo bạn muốn nhận</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Demand Signal tăng', desc: 'Khi SKU được spec nhiều hơn bình thường', on: true },
                { label: 'Completeness alert', desc: 'Khi SKU rơi xuống dưới 65%', on: true },
                { label: 'SKU review status', desc: 'Khi SKU được approve hoặc flag', on: true },
                { label: 'Dealer activity', desc: 'Khi dealer xem giá hoặc đặt hàng', on: false },
                { label: 'Weekly digest', desc: 'Tóm tắt tuần qua email', on: true },
                { label: 'AI extraction complete', desc: 'Khi AI extract hoàn tất', on: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Bảo mật</CardTitle><CardDescription>Mật khẩu và xác thực 2 lớp</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu hiện tại</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Mật khẩu mới</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="space-y-2"><Label>Xác nhận mật khẩu</Label><Input type="password" placeholder="••••••••" /></div>
              </div>
              <Button>Đổi mật khẩu</Button>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium flex items-center gap-2"><Key className="h-4 w-4" /> Xác thực 2 lớp (2FA)</div>
                  <div className="text-xs text-muted-foreground">Bảo vệ tài khoản bằng TOTP</div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4" /> API Keys</div>
                  <div className="text-xs text-muted-foreground">Token truy cập SpecIt API</div>
                </div>
                <Button variant="outline" size="sm">Generate Token</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
