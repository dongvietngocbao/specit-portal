import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreBadge } from '@/components/score-badge';
import { StatusBadge } from '@/components/status-badge';
import { ColorSwatch } from '@/components/color-swatch';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  Package, CheckCircle2, TrendingUp, Eye, ArrowUpRight, ArrowDownRight,
  Upload, AlertTriangle, Star, MapPin, FileText, Store, ArrowRight,
} from 'lucide-react';
import { MOCK_SKUS } from '@/lib/mock/skus';
import { MOCK_DEMAND_SIGNALS } from '@/lib/mock/demand-signals';
import { MOCK_NOTIFICATIONS } from '@/lib/mock/notifications';
import { formatCurrency, formatNumber, timeAgo, cn } from '@/lib/utils';

export default function DashboardPage() {
  const totalSkus = MOCK_SKUS.length;
  const activeSkus = MOCK_SKUS.filter((s) => s.status === 'active').length;
  const avgScore = Math.round(MOCK_SKUS.reduce((sum, s) => sum + s.system.completeness_score, 0) / totalSkus);
  const totalSpecs = MOCK_DEMAND_SIGNALS.reduce((sum, d) => sum + d.spec_count, 0);

  const lowScoreSkus = MOCK_SKUS
    .filter((s) => s.system.completeness_score < 65)
    .sort((a, b) => a.system.completeness_score - b.system.completeness_score);

  const topSkus = [...MOCK_SKUS]
    .sort((a, b) => b.system.completeness_score - a.system.completeness_score)
    .slice(0, 5);

  const recentNotifs = MOCK_NOTIFICATIONS.slice(0, 3);

  // Bar chart data
  const specTrend = [
    { month: 'T2', specs: 95 },
    { month: 'T3', specs: 120 },
    { month: 'T4', specs: 145 },
    { month: 'T5', specs: 165 },
    { month: 'T6', specs: 180 },
    { month: 'T7', specs: 198 },
    { month: 'T8', specs: 238 },
  ];
  const maxSpecs = Math.max(...specTrend.map((s) => s.specs));

  // Score distribution
  const scoreBands = [
    { label: '★★ Premium (90+)', count: MOCK_SKUS.filter((s) => s.system.completeness_score >= 90).length, color: 'bg-[hsl(262_52%_54%)]' },
    { label: '★ Verified (80-89)', count: MOCK_SKUS.filter((s) => s.system.completeness_score >= 80 && s.system.completeness_score < 90).length, color: 'bg-[hsl(250_60%_55%)]' },
    { label: 'Active (65-79)', count: MOCK_SKUS.filter((s) => s.system.completeness_score >= 65 && s.system.completeness_score < 80).length, color: 'bg-[hsl(199_89%_48%)]' },
    { label: 'Partial (41-64)', count: MOCK_SKUS.filter((s) => s.system.completeness_score >= 41 && s.system.completeness_score < 65).length, color: 'bg-[hsl(38_92%_50%)]' },
    { label: 'Draft (0-40)', count: MOCK_SKUS.filter((s) => s.system.completeness_score < 41).length, color: 'bg-[hsl(0_72%_51%)]' },
  ];

  const kpis = [
    { label: 'Tổng SKU', value: formatNumber(totalSkus), change: '+3', changeUp: true, icon: Package },
    { label: 'SKU Active', value: formatNumber(activeSkus), change: '+2', changeUp: true, icon: CheckCircle2 },
    { label: 'Điểm TB hoàn thiện', value: `${avgScore}%`, change: '+5%', changeUp: true, icon: TrendingUp },
    { label: 'Lượt spec tháng này', value: formatNumber(totalSpecs), change: '+18%', changeUp: true, icon: Eye },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng quan hiệu suất SKU Viglacera Corporation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/analytics">
              <FileText className="h-4 w-4" /> Xem báo cáo
            </Link>
          </Button>
          <Button asChild>
            <Link href="/upload">
              <Upload className="h-4 w-4" /> Upload SKU
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1 tabular-nums">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <span className={cn('inline-flex items-center font-medium', kpi.changeUp ? 'text-[hsl(142_71%_45%)]' : 'text-destructive')}>
                        {kpi.changeUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {kpi.change}
                      </span>
                      <span className="text-muted-foreground">vs tháng trước</span>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spec trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lượt Spec theo thời gian</CardTitle>
            <CardDescription>Số lần KTS spec SKU của bạn (6 tháng gần nhất)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
              {specTrend.map((d, i) => (
                <div key={d.month} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex flex-col items-center group relative">
                    <span className="text-xs font-medium tabular-nums opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">
                      {d.specs}
                    </span>
                    <div
                      className="w-full max-w-[2.5rem] rounded-t-md bg-primary/80 hover:bg-primary transition-all cursor-pointer"
                      style={{ height: `${(d.specs / maxSpecs) * 160}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tổng 6 tháng</span>
              <span className="font-semibold tabular-nums">{formatNumber(specTrend.reduce((s, d) => s + d.specs, 0))} lượt</span>
            </div>
          </CardContent>
        </Card>

        {/* Score distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ điểm SKU</CardTitle>
            <CardDescription>Theo completeness score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scoreBands.map((band) => (
              <div key={band.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{band.label}</span>
                  <span className="font-semibold tabular-nums">{band.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', band.color)}
                    style={{ width: `${(band.count / totalSkus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top SKUs + Low score alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top performing SKUs */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>SKU Top Performance</CardTitle>
              <CardDescription>Theo completeness score</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/skus">Xem tất cả <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topSkus.map((sku, idx) => (
                <Link
                  key={sku.id}
                  href={`/skus/${sku.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-muted-foreground w-4 tabular-nums">{idx + 1}</span>
                  <ColorSwatch hex={sku.matching.color_hex} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{sku.product_name}</span>
                      {sku.system.completeness_score >= 90 && <Star className="h-3 w-3 fill-[hsl(262_52%_54%)] text-[hsl(262_52%_54%)]" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{sku.sku_id} · {sku.matching.finish}</div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium tabular-nums">{formatCurrency(sku.commercial.price_value || 0)}/m²</div>
                  </div>
                  <ScoreBadge score={sku.system.completeness_score} size="sm" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs attention */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[hsl(38_92%_50%)]" />
              <CardTitle>Cần chú ý</CardTitle>
            </div>
            <CardDescription>SKU cần bổ sung data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowScoreSkus.slice(0, 4).map((sku) => (
              <Link key={sku.id} href={`/skus/${sku.id}`} className="block rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate flex-1">{sku.product_name}</span>
                  <ScoreBadge score={sku.system.completeness_score} size="sm" />
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress value={sku.system.completeness_score} className="h-1" indicatorClassName={
                    sku.system.completeness_score < 41 ? 'bg-destructive' :
                    sku.system.completeness_score < 65 ? 'bg-[hsl(38_92%_50%)]' : 'bg-primary'
                  } />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    +{100 - sku.system.completeness_score}% khả năng nâng
                  </span>
                </div>
              </Link>
            ))}
            {lowScoreSkus.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Tất cả SKU đều ≥ 65% 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity + Demand highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent notifications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Hoạt động gần đây</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/notifications">Tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotifs.map((notif) => (
              <div key={notif.id} className="flex gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  notif.type === 'demand' ? 'bg-primary/10 text-primary' :
                  notif.type === 'completeness' ? 'bg-[hsl(38_92%_90%)] text-[hsl(38_92%_40%)] dark:bg-[hsl(38_92%_15%)] dark:text-[hsl(38_92%_70%)]' :
                  notif.type === 'review' ? 'bg-[hsl(142_71%_90%)] text-[hsl(142_71%_40%)] dark:bg-[hsl(142_71%_15%)] dark:text-[hsl(142_71%_65%)]' :
                  'bg-muted text-muted-foreground'
                )}>
                  {notif.type === 'demand' ? <TrendingUp className="h-4 w-4" /> :
                   notif.type === 'completeness' ? <AlertTriangle className="h-4 w-4" /> :
                   notif.type === 'review' ? <CheckCircle2 className="h-4 w-4" /> :
                   <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(notif.created_at)}</p>
                </div>
                {!notif.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Demand signal highlights */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Demand Signal</CardTitle>
              <CardDescription>SKU đang được spec nhiều nhất</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/demand-signals">Chi tiết</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_DEMAND_SIGNALS.slice(0, 3).map((signal) => (
              <Link key={signal.sku_id} href="/demand-signals" className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1">{signal.product_name}</span>
                  <Badge variant={signal.trend === 'up' ? 'success' : signal.trend === 'down' ? 'destructive' : 'secondary'} className="ml-2">
                    {signal.spec_count} specs
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className={cn(
                    'inline-flex items-center gap-0.5',
                    signal.trend === 'up' ? 'text-[hsl(142_71%_45%)]' : signal.trend === 'down' ? 'text-destructive' : ''
                  )}>
                    {signal.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : signal.trend === 'down' ? <ArrowDownRight className="h-3 w-3" /> : null}
                    {signal.spec_count_change > 0 ? '+' : ''}{signal.spec_count_change}%
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" /> {signal.top_regions[0]?.region}
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
