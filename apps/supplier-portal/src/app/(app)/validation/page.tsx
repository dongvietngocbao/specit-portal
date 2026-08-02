import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScoreBadge } from '@/components/score-badge';
import { StatusBadge } from '@/components/status-badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  CheckCircle2, AlertCircle, XCircle, ShieldCheck, TrendingUp,
  ArrowRight, Sparkles,
} from 'lucide-react';
import { MOCK_SKUS } from '@/lib/mock/skus';
import { calculateCompleteness } from '@specit/canonical-schema';
import { cn } from '@/lib/utils';

export default function ValidationPage() {
  const skuScores = MOCK_SKUS.map(sku => {
    const skuData: Record<string, unknown> = {
      product_name: sku.product_name,
      material_type: sku.material_type,
      supplier_id: sku.supplier_id,
      brand: sku.brand,
      width_mm: sku.dimension.width_mm,
      height_mm: sku.dimension.height_mm,
      thickness_mm: sku.dimension.thickness_mm,
      color_family: sku.matching.color_family,
      finish: sku.matching.finish,
      application: sku.matching.application,
      location: sku.matching.location,
      style_tags: sku.matching.style_tags,
      slip_rating: sku.performance.slip_rating,
      pei_rating: sku.performance.pei_rating,
      price_per_box: sku.commercial.price_per_box,
      price_unit_original: sku.commercial.price_unit_original,
      currency: sku.commercial.currency,
      texture_diffuse: sku.matching.color_hex ? 'yes' : null,
      product_image: sku.matching.color_hex ? 'yes' : null,
    };
    const completeness = calculateCompleteness(sku.material_type, skuData);
    return { sku, completeness };
  });

  const sorted = [...skuScores].sort((a, b) => a.completeness.score - b.completeness.score);
  const avgScore = Math.round(skuScores.reduce((s, x) => s + x.completeness.score, 0) / skuScores.length);

  const validationChecks = [
    { name: 'Schema Validation', desc: 'Mỗi SKU đúng field set của material_type', status: 'pass', count: 12 },
    { name: 'Required Fields', desc: 'T0 + T1 required fields đã điền', status: 'warn', count: 9 },
    { name: 'Price Normalization', desc: 'Giá về đơn vị chuẩn (m²)', status: 'pass', count: 12 },
    { name: 'Dimension Standardization', desc: 'mm units, auto-calc pieces_per_m²', status: 'pass', count: 12 },
    { name: 'Deduplication', desc: 'Không có SKU trùng lặp', status: 'pass', count: 12 },
    { name: 'Asset Completeness', desc: 'Texture/Photo uploads', status: 'warn', count: 7 },
    { name: 'Standards Mapping', desc: 'CSI/TCVN auto-assigned', status: 'pass', count: 12 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Validation & Completeness</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Đánh giá chất lượng data theo canonical schema
        </p>
      </div>

      {/* Validation checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Validation Checks</CardTitle>
          <CardDescription>Spec Engine tự động kiểm tra mỗi SKU</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {validationChecks.map((check) => (
            <div key={check.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {check.status === 'pass' ? (
                  <CheckCircle2 className="h-5 w-5 text-[hsl(142_71%_45%)]" />
                ) : check.status === 'warn' ? (
                  <AlertCircle className="h-5 w-5 text-[hsl(38_92%_50%)]" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <div className="text-sm font-medium">{check.name}</div>
                  <div className="text-xs text-muted-foreground">{check.desc}</div>
                </div>
              </div>
              <Badge variant={check.status === 'pass' ? 'success' : check.status === 'warn' ? 'warning' : 'destructive'}>
                {check.count}/12
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Completeness breakdown per SKU */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Completeness Audit</CardTitle>
            <CardDescription>
              Điểm trung bình: <span className="font-bold text-foreground">{avgScore}%</span> · Sắp xếp theo điểm thấp nhất
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sorted.map(({ sku, completeness }) => (
              <div key={sku.id} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <Link href={`/skus/${sku.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{sku.product_name}</span>
                      <StatusBadge status={sku.status} />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{sku.sku_id}</p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-muted-foreground">{completeness.filled_count}/{completeness.total_count} fields</span>
                    </div>
                    <ScoreBadge score={completeness.score} />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/skus/${sku.id}`}>Fix <ArrowRight className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </div>
                <Progress
                  value={completeness.score}
                  className="h-1.5"
                  indicatorClassName={
                    completeness.score >= 90 ? 'bg-[hsl(262_52%_54%)]' :
                    completeness.score >= 80 ? 'bg-[hsl(250_60%_55%)]' :
                    completeness.score >= 65 ? 'bg-[hsl(199_89%_48%)]' :
                    completeness.score >= 41 ? 'bg-[hsl(38_92%_50%)]' : 'bg-destructive'
                  }
                />
                {completeness.gaps.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {completeness.gaps.slice(0, 5).map(gap => (
                      <Badge key={gap.field_id} variant="outline" className="text-xs text-[hsl(38_92%_50%)] border-[hsl(38_92%_50%)]/30">
                        +{gap.label_vi}
                      </Badge>
                    ))}
                    {completeness.gaps.length > 5 && (
                      <Badge variant="outline" className="text-xs">+{completeness.gaps.length - 5} more</Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
