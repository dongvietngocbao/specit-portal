import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Download, MapPin,
  Layers, DollarSign, Package,
} from 'lucide-react';
import { MOCK_SKUS } from '@/lib/mock/skus';
import { MOCK_DEMAND_SIGNALS } from '@/lib/mock/demand-signals';
import {
  MOCK_SPEC_TREND, MOCK_TOP_REGIONS, MOCK_COLLECTION_PERFORMANCE,
  MOCK_SCORE_DISTRIBUTION,
} from '@/lib/mock/analytics';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const totalSpecs = MOCK_SPEC_TREND.reduce((s, d) => s + d.specs, 0);
  const maxSpecs = Math.max(...MOCK_SPEC_TREND.map(d => d.specs));
  const totalRevenue = MOCK_SKUS.reduce((s, sku) => s + (sku.commercial.price_value || 0), 0);
  const avgPrice = Math.round(totalRevenue / MOCK_SKUS.length);

  // Collection performance chart max
  const maxCollectionSpecs = Math.max(...MOCK_COLLECTION_PERFORMANCE.map(c => c.total_specs));

  // Color distribution
  const colorCounts: Record<string, number> = {};
  MOCK_SKUS.forEach(s => {
    const c = s.matching.color_family;
    colorCounts[c] = (colorCounts[c] || 0) + 1;
  });
  const colorLabels: Record<string, string> = {
    warm_grey: '#B8A99A', black: '#1A1A1A', green: '#5CB85C', white: '#F5F5F0',
    beige: '#D4C5A9', grey: '#808080', wood_tone: '#B8860B', blue: '#1E3A8A', red: '#FFB6C1',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Insight về hiệu suất SKU và thị trường</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng lượt spec', value: formatNumber(totalSpecs), change: '+18%', icon: BarChart3, up: true },
          { label: 'Giá TB/m²', value: formatCurrency(avgPrice), change: '+3%', icon: DollarSign, up: true },
          { label: 'SKU Active', value: '8/12', change: '67%', icon: Package, up: true },
          { label: 'Collections', value: '9', change: '0', icon: Layers, up: null },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}><CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold tabular-nums mt-1">{s.value}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
              </div>
              {s.up !== null && (
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <span className={cn('inline-flex items-center', s.up ? 'text-[hsl(142_71%_45%)]' : 'text-destructive')}>
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.change}
                  </span>
                </div>
              )}
            </CardContent></Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spec trend */}
        <Card>
          <CardHeader><CardTitle>Spec Trend 6 tháng</CardTitle><CardDescription>Lượt spec theo tháng</CardDescription></CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
              {MOCK_SPEC_TREND.map(d => (
                <div key={d.month} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex flex-col items-center group relative">
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 absolute -top-6">{d.specs}</span>
                    <div className="w-full max-w-[2.5rem] rounded-t-md bg-primary/80 hover:bg-primary transition-all cursor-pointer" style={{ height: `${(d.specs / maxSpecs) * 160}px` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top regions */}
        <Card>
          <CardHeader><CardTitle>Spec theo khu vực</CardTitle><CardDescription>Top 5 thành phố</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_TOP_REGIONS.map((r, i) => (
              <div key={r.region} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}</span>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">{r.region}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(r.spec_count / MOCK_TOP_REGIONS[0].spec_count) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums w-8 text-right">{r.spec_count}</span>
                  <span className={cn('text-xs w-10', r.growth >= 0 ? 'text-[hsl(142_71%_45%)]' : 'text-destructive')}>
                    {r.growth >= 0 ? '+' : ''}{r.growth}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Collection performance */}
        <Card>
          <CardHeader><CardTitle>Collection Performance</CardTitle><CardDescription>Điểm TB + lượt spec</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_COLLECTION_PERFORMANCE.map(c => (
              <div key={c.collection} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{c.collection}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{c.sku_count} SKU</span>
                    <Badge variant="secondary" className="text-xs">{c.avg_score}% avg</Badge>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(c.total_specs / maxCollectionSpecs) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{c.total_specs} lượt spec</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Score distribution */}
        <Card>
          <CardHeader><CardTitle>Phân bổ điểm</CardTitle><CardDescription>Theo completeness score</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_SCORE_DISTRIBUTION.slice(0, 5).map(band => (
              <div key={band.band}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{band.label}</span>
                  <span className="font-semibold tabular-nums">{band.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(band.count / MOCK_SKUS.length) * 100}%`, backgroundColor: band.color }} />
                </div>
              </div>
            ))}
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colorCounts).map(([color, count]) => (
                <div key={color} className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: colorLabels[color] || '#ccc' }} />
                  <span className="capitalize flex-1">{color}</span>
                  <span className="text-muted-foreground tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price analysis */}
      <Card>
        <CardHeader><CardTitle>Price Analysis</CardTitle><CardDescription>Phân khúc giá theo SKU</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MOCK_SKUS.sort((a, b) => (a.commercial.price_value || 0) - (b.commercial.price_value || 0)).map(sku => (
              <div key={sku.id} className="flex items-center gap-3">
                <span className="text-sm flex-1 truncate">{sku.product_name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={cn(
                      'h-full rounded-full',
                      (sku.commercial.price_value || 0) < 200000 ? 'bg-[hsl(142_71%_45%)]' :
                      (sku.commercial.price_value || 0) < 300000 ? 'bg-[hsl(199_89%_48%)]' :
                      (sku.commercial.price_value || 0) < 400000 ? 'bg-[hsl(262_52%_54%)]' : 'bg-[hsl(0_72%_51%)]'
                    )} style={{ width: `${((sku.commercial.price_value || 0) / 450000) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums w-24 text-right">{formatCurrency(sku.commercial.price_value || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
