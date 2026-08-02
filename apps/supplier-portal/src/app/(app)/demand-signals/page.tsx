import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScoreBadge } from '@/components/score-badge';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Minus, MapPin, Sparkles, ArrowUpRight,
  ArrowDownRight, Target, Lightbulb, ArrowRight,
} from 'lucide-react';
import { MOCK_DEMAND_SIGNALS } from '@/lib/mock/demand-signals';
import { MOCK_SKUS } from '@/lib/mock/skus';
import { cn } from '@/lib/utils';

export default function DemandSignalsPage() {
  const totalSpecs = MOCK_DEMAND_SIGNALS.reduce((s, d) => s + d.spec_count, 0);
  const upCount = MOCK_DEMAND_SIGNALS.filter(d => d.trend === 'up').length;
  const downCount = MOCK_DEMAND_SIGNALS.filter(d => d.trend === 'down').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Demand Signals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dữ liệu nhu cầu từ KTS — biết SKU nào đang được spec nhiều
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng lượt spec</p>
              <p className="text-3xl font-bold tabular-nums">{totalSpecs}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Target className="h-5 w-5 text-primary" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang tăng</p>
              <p className="text-3xl font-bold tabular-nums text-[hsl(142_71%_45%)]">{upCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(142_71%_90%)] dark:bg-[hsl(142_71%_15%)]"><TrendingUp className="h-5 w-5 text-[hsl(142_71%_45%)]" /></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang giảm</p>
              <p className="text-3xl font-bold tabular-nums text-destructive">{downCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10"><TrendingDown className="h-5 w-5 text-destructive" /></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Demand signal cards */}
      <div className="space-y-4">
        {MOCK_DEMAND_SIGNALS.map(signal => {
          const sku = MOCK_SKUS.find(s => s.sku_id === signal.sku_id);
          const TrendIcon = signal.trend === 'up' ? TrendingUp : signal.trend === 'down' ? TrendingDown : Minus;
          const trendColor = signal.trend === 'up' ? 'text-[hsl(142_71%_45%)]' : signal.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

          return (
            <Card key={signal.sku_id}>
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Left: SKU info + trend */}
                  <div className="flex items-start gap-3 lg:w-64 shrink-0">
                    {sku && (
                      <Link href={`/skus/${sku.id}`}>
                        <div className="h-12 w-12 rounded-lg border shrink-0" style={{ backgroundColor: sku.matching.color_hex }} />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link href={`/skus/${sku?.id}`} className="font-medium hover:underline line-clamp-2">{signal.product_name}</Link>
                      <p className="text-xs text-muted-foreground font-mono">{signal.sku_id}</p>
                      {sku && <div className="mt-1"><ScoreBadge score={sku.system.completeness_score} size="sm" /></div>}
                    </div>
                  </div>

                  {/* Middle: specs + trend */}
                  <div className="flex items-center gap-6 flex-1">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Specs</div>
                      <div className="text-2xl font-bold tabular-nums">{signal.spec_count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Thay đổi</div>
                      <div className={cn('flex items-center gap-1 text-lg font-bold', trendColor)}>
                        <TrendIcon className="h-4 w-4" />
                        {signal.spec_count_change > 0 ? '+' : ''}{signal.spec_count_change}%
                      </div>
                    </div>
                  </div>

                  {/* Right: regions + action */}
                  <div className="lg:w-64 shrink-0 space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Top khu vực</div>
                      <div className="flex flex-wrap gap-1">
                        {signal.top_regions.map(r => (
                          <Badge key={r.region} variant="secondary" className="text-xs gap-1">
                            <MapPin className="h-2.5 w-2.5" />{r.region} ({r.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Suggested action */}
                <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/15 p-3">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{signal.suggested_action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Completeness gap: +{signal.score_gap}% khả năng nâng điểm
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Nâng điểm <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
