import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Store, MapPin, Phone, Mail, TrendingUp, Plus, Download,
  DollarSign, Percent, ArrowUpRight,
} from 'lucide-react';
import { MOCK_DEALERS, MOCK_DEALER_PRICES } from '@/lib/mock/dealers';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';

export default function DealersPage() {
  const totalVolume = MOCK_DEALERS.reduce((s, d) => s + d.total_volume_m2, 0);
  const activeDealers = MOCK_DEALERS.filter(d => d.status === 'active').length;

  const tierColors: Record<string, string> = {
    tier_1: 'bg-[hsl(262_52%_54%)] text-white',
    tier_2: 'bg-[hsl(199_89%_48%)] text-white',
    tier_3: 'bg-muted text-muted-foreground',
  };
  const tierLabels: Record<string, string> = {
    tier_1: 'Tier 1',
    tier_2: 'Tier 2',
    tier_3: 'Tier 3',
  };
  const typeLabels: Record<string, string> = {
    distributor: 'Nhà phân phối',
    dealer: 'Đại lý',
    trading: 'Trading',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dealer Network</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý đại lý, nhà phân phối và giá dealer
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
          <Button><Plus className="h-4 w-4" /> Thêm Dealer</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Tổng Dealer</p>
          <p className="text-2xl font-bold tabular-nums">{MOCK_DEALERS.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-2xl font-bold tabular-nums text-[hsl(142_71%_45%)]">{activeDealers}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Tổng Volume</p>
          <p className="text-2xl font-bold tabular-nums">{formatNumber(totalVolume)} m²</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Khu vực</p>
          <p className="text-2xl font-bold tabular-nums">{new Set(MOCK_DEALERS.map(d => d.region)).size}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="dealers">
        <TabsList>
          <TabsTrigger value="dealers">Danh sách Dealer</TabsTrigger>
          <TabsTrigger value="pricing">Bảng giá Dealer</TabsTrigger>
        </TabsList>

        {/* Dealers list */}
        <TabsContent value="dealers" className="space-y-4">
          {MOCK_DEALERS.map(dealer => (
            <Card key={dealer.id}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Left: identity */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dealer.name}</span>
                        <Badge className={cn('text-xs', tierColors[dealer.tier])}>{tierLabels[dealer.tier]}</Badge>
                        <Badge variant={dealer.status === 'active' ? 'success' : dealer.status === 'pending' ? 'warning' : 'secondary'} className="text-xs">
                          {dealer.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{typeLabels[dealer.type]}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{dealer.region}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{dealer.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{dealer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: stats */}
                  <div className="flex items-center gap-6 lg:border-l lg:pl-6">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">SKUs</div>
                      <div className="text-xl font-bold tabular-nums">{dealer.sku_count}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Volume (m²)</div>
                      <div className="text-xl font-bold tabular-nums">{formatNumber(dealer.total_volume_m2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Đơn cuối</div>
                      <div className="text-sm font-medium">{dealer.last_order}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Dealer pricing */}
        <TabsContent value="pricing">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Bảng giá Dealer</CardTitle>
              <CardDescription>Giá dealer so với giá list (m²)</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Dealer</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">SKU</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Giá List</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Giá Dealer</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Chiết khấu</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DEALER_PRICES.map((entry, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Store className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{entry.dealer_name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{entry.sku_name}</td>
                      <td className="p-3 text-right tabular-nums text-muted-foreground line-through">{formatCurrency(entry.list_price)}</td>
                      <td className="p-3 text-right font-medium tabular-nums">{formatCurrency(entry.dealer_price)}</td>
                      <td className="p-3 text-center">
                        <Badge variant={entry.discount_percent >= 15 ? 'success' : 'secondary'} className="gap-1">
                          <Percent className="h-2.5 w-2.5" />{entry.discount_percent}%
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">{entry.last_updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
