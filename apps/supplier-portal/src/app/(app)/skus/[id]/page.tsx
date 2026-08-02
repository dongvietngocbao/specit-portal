import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/score-badge';
import { StatusBadge } from '@/components/status-badge';
import { ColorSwatch } from '@/components/color-swatch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Edit, Download, Copy, Star, TrendingUp, Package, Ruler,
  Shield, DollarSign, Image as ImageIcon, FileText, CheckCircle2, AlertCircle,
  Layers, Boxes, Zap, Award, MapPin,
} from 'lucide-react';
import { MOCK_SKUS, getSkuById } from '@/lib/mock/skus';
import { MOCK_DEMAND_SIGNALS } from '@/lib/mock/demand-signals';
import { calculateCompleteness, MATERIAL_TYPES, FIELD_MAP } from '@specit/canonical-schema';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export function generateStaticParams() {
  return MOCK_SKUS.map((sku) => ({ id: sku.id }));
}

export default async function SkuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sku = getSkuById(id);
  if (!sku) notFound();

  // Calculate completeness using the canonical scoring engine
  const skuData: Record<string, unknown> = {
    product_name: sku.product_name,
    material_type: sku.material_type,
    supplier_id: sku.supplier_id,
    brand: sku.brand,
    model_number: sku.model_number,
    collection_name: sku.collection_name,
    country_of_origin: sku.country_of_origin,
    application: sku.matching.application,
    location: sku.matching.location,
    color_family: sku.matching.color_family,
    finish: sku.matching.finish,
    style_tags: sku.matching.style_tags,
    space_type: sku.matching.space_type,
    width_mm: sku.dimension.width_mm,
    height_mm: sku.dimension.height_mm,
    thickness_mm: sku.dimension.thickness_mm,
    weight_kg_m2: sku.dimension.weight_kg_m2,
    edge_type: sku.dimension.edge_type,
    pieces_per_box: sku.packaging.pieces_per_box,
    box_weight_kg: sku.packaging.box_weight_kg,
    boxes_per_pallet: sku.packaging.boxes_per_pallet,
    slip_rating: sku.performance.slip_rating,
    pei_rating: sku.performance.pei_rating,
    water_absorption: sku.performance.water_absorption,
    ac_rating: sku.performance.ac_rating,
    fire_rating: sku.performance.fire_rating,
    warranty_years: sku.performance.warranty_years,
    certification: sku.performance.certification,
    installation_method: sku.performance.installation_method,
    recommended_joint_mm: sku.performance.recommended_joint_mm,
    price_per_box: sku.commercial.price_per_box,
    price_unit_original: sku.commercial.price_unit_original,
    currency: sku.commercial.currency,
    texture_diffuse: sku.matching.color_hex ? 'has_diffuse' : null,
    product_image: sku.matching.color_hex ? 'has_image' : null,
    texture_normal: null,
    texture_roughness: null,
    product_image_room: null,
  };

  const completeness = calculateCompleteness(sku.material_type, skuData);
  const materialType = MATERIAL_TYPES.find((t) => t.material_type_id === sku.material_type);
  const demandSignal = MOCK_DEMAND_SIGNALS.find((d) => d.sku_id === sku.sku_id);

  const infoRows = [
    { label: 'SKU Code', value: sku.sku_id, mono: true },
    { label: 'Model No.', value: sku.model_number || '—', mono: true },
    { label: 'Brand', value: sku.brand },
    { label: 'Collection', value: sku.collection_name || '—' },
    { label: 'Loại vật liệu', value: materialType?.name_vi || sku.material_type },
    { label: 'Xuất xứ', value: sku.country_of_origin || '—' },
    { label: 'Tên màu gốc', value: sku.supplier_color_name || '—' },
  ];

  const matchingRows = [
    { label: 'Application', value: sku.matching.application.join(', ') },
    { label: 'Location', value: sku.matching.location.join(', ') },
    { label: 'Color Family', value: sku.matching.color_family, hasSwatch: true, hex: sku.matching.color_hex },
    { label: 'Tone', value: sku.matching.tone },
    { label: 'Pattern', value: sku.matching.pattern },
    { label: 'Finish', value: sku.matching.finish },
    { label: 'Slip Rating', value: sku.matching.slip_rating || '—' },
    { label: 'Price Segment', value: sku.matching.price_segment },
  ];

  const dimensionRows = [
    { label: 'Kích thước', value: `${sku.dimension.width_mm} × ${sku.dimension.height_mm} × ${sku.dimension.thickness_mm} mm` },
    { label: 'Trọng lượng', value: sku.dimension.weight_kg_m2 ? `${sku.dimension.weight_kg_m2} kg/m²` : '—' },
    { label: 'Số viên/m²', value: sku.dimension.pieces_per_m2?.toString() || '—' },
    { label: 'Kiểu cạnh', value: sku.dimension.edge_type || '—' },
  ];

  const performanceRows = [
    { label: 'Slip Rating', value: sku.performance.slip_rating || '—' },
    { label: 'PEI Rating', value: sku.performance.pei_rating || '—' },
    { label: 'Hút nước', value: sku.performance.water_absorption != null ? `${sku.performance.water_absorption}%` : '—' },
    { label: 'Chống cháy', value: sku.performance.fire_rating || '—' },
    { label: 'Độ bền uốn', value: sku.performance.breaking_strength_n ? `${sku.performance.breaking_strength_n} N` : '—' },
    { label: 'Bảo hành', value: sku.performance.warranty_years ? `${sku.performance.warranty_years} năm` : '—' },
    { label: 'Lắp đặt', value: sku.performance.installation_method || '—' },
    { label: 'Khe mạch', value: sku.performance.recommended_joint_mm ? `${sku.performance.recommended_joint_mm} mm` : '—' },
  ];

  const commercialRows = [
    { label: 'Giá/hộp', value: sku.commercial.price_per_box ? formatCurrency(sku.commercial.price_per_box) : '—' },
    { label: 'Đơn vị gốc', value: sku.commercial.price_unit_original || '—' },
    { label: 'Giá/m² (normalized)', value: sku.commercial.price_value ? formatCurrency(sku.commercial.price_value) : '—' },
    { label: 'Loại giá', value: sku.commercial.price_type },
    { label: 'Tiền tệ', value: sku.commercial.currency },
    { label: 'VAT', value: sku.commercial.vat_included ? 'Đã bao gồm' : 'Chưa bao gồm' },
    { label: 'Lead time', value: sku.commercial.lead_time_days ? `${sku.commercial.lead_time_days} ngày` : '—' },
    { label: 'Availability', value: sku.commercial.availability || '—' },
  ];

  const packagingRows = [
    { label: 'Viên/hộp', value: sku.packaging.pieces_per_box?.toString() || '—' },
    { label: 'm²/hộp', value: sku.packaging.box_coverage_m2?.toString() || '—' },
    { label: 'kg/hộp', value: sku.packaging.box_weight_kg?.toString() || '—' },
    { label: 'Hộp/pallet', value: sku.packaging.boxes_per_pallet?.toString() || '—' },
  ];

  const standardRows = [
    { label: 'CSI MasterFormat', value: sku.standards.csi_masterformat, mono: true },
    { label: 'TCVN', value: sku.standards.tcvn },
    { label: 'ISO', value: sku.standards.iso?.join(', ') || '—' },
    { label: 'Quy chuẩn', value: sku.standards.national_code || '—' },
  ];

  const systemRows = [
    { label: 'Ngày tạo', value: formatDate(sku.system.created_at) },
    { label: 'Cập nhật', value: formatDate(sku.system.updated_at) },
    { label: 'Phiên bản', value: `v${sku.system.version}` },
    { label: 'Nguồn', value: sku.system.source_type },
    { label: 'Review', value: sku.system.review_status },
    { label: 'Extraction ID', value: sku.system.raw_extraction_id || '—', mono: true },
  ];

  function InfoTable({ rows, title, icon: Icon }: { rows: { label: string; value: string; mono?: boolean; hasSwatch?: boolean; hex?: string }[]; title: string; icon: any }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
                <dt className="text-sm text-muted-foreground shrink-0">{row.label}</dt>
                <dd className="text-sm font-medium text-right flex items-center gap-1.5">
                  {row.hasSwatch && row.hex && <ColorSwatch hex={row.hex} size="sm" />}
                  <span className={cn(row.mono && 'font-mono text-xs')}>{row.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/skus"><ArrowLeft className="h-4 w-4" /> Quay lại</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Copy className="h-4 w-4" /> Duplicate</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export PDF</Button>
          <Button size="sm"><Edit className="h-4 w-4" /> Edit SKU</Button>
        </div>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Visual */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-xl shadow-lg relative overflow-hidden border" style={{ backgroundColor: sku.matching.color_hex }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-start gap-2">
                <StatusBadge status={sku.status} />
                <ScoreBadge score={sku.system.completeness_score} />
                {sku.matching.style_tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{sku.product_name}</h1>
                <p className="text-sm text-muted-foreground font-mono">{sku.sku_id}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {sku.brand}</span>
                <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {sku.collection_name}</span>
                <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" /> {sku.dimension.width_mm}×{sku.dimension.height_mm}mm</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {formatCurrency(sku.commercial.price_value || 0)}/{sku.commercial.price_unit}</span>
              </div>
            </div>
            {/* Demand */}
            {demandSignal && (
              <div className="flex-shrink-0 lg:border-l lg:pl-6 space-y-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Demand Signal</div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold tabular-nums">{demandSignal.spec_count}</span>
                  <Badge variant={demandSignal.trend === 'up' ? 'success' : demandSignal.trend === 'down' ? 'destructive' : 'secondary'}>
                    <TrendingUp className="h-3 w-3" /> {demandSignal.spec_count_change > 0 ? '+' : ''}{demandSignal.spec_count_change}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Spec'd {demandSignal.spec_count} lần bởi KTS
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="completeness">Completeness ({completeness.score}%)</TabsTrigger>
          <TabsTrigger value="matching">Matching Fields</TabsTrigger>
          <TabsTrigger value="assets">Media</TabsTrigger>
          <TabsTrigger value="demand">Demand</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoTable title="Thông tin sản phẩm" icon={Package} rows={infoRows} />
            <InfoTable title="Kích thước" icon={Ruler} rows={dimensionRows} />
            <InfoTable title="Hiệu năng" icon={Zap} rows={performanceRows} />
            <InfoTable title="Thương mại" icon={DollarSign} rows={commercialRows} />
            <InfoTable title="Đóng gói" icon={Boxes} rows={packagingRows} />
            <InfoTable title="Tiêu chuẩn" icon={Award} rows={standardRows} />
          </div>
        </TabsContent>

        {/* Completeness Tab */}
        <TabsContent value="completeness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Completeness Score: {completeness.score}%
              </CardTitle>
              <CardDescription>
                {completeness.filled_count}/{completeness.total_count} fields filled · {completeness.earned}/{completeness.max} points earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={completeness.score} className="h-3" indicatorClassName={
                  completeness.score >= 90 ? 'bg-[hsl(262_52%_54%)]' :
                  completeness.score >= 80 ? 'bg-[hsl(250_60%_55%)]' :
                  completeness.score >= 65 ? 'bg-[hsl(199_89%_48%)]' :
                  completeness.score >= 41 ? 'bg-[hsl(38_92%_50%)]' : 'bg-destructive'
                } />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Filled fields */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(142_71%_45%)]" />
                    Đã điền ({completeness.fields.filter(f => f.filled).length})
                  </h4>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
                    {completeness.fields.filter(f => f.filled).map((field) => (
                      <div key={field.field_id} className="flex items-center justify-between text-sm rounded-md px-2 py-1 bg-[hsl(142_71%_95%)] dark:bg-[hsl(142_71%_10%)]">
                        <span className="truncate">{field.label_vi}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-xs">{field.tier}</Badge>
                          <span className="text-xs text-muted-foreground">+{field.earned}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gaps */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[hsl(38_92%_50%)]" />
                    Cần bổ sung ({completeness.gaps.length})
                  </h4>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
                    {completeness.gaps.map((field) => (
                      <div key={field.field_id} className="flex items-center justify-between text-sm rounded-md px-2 py-1 bg-[hsl(38_92%_95%)] dark:bg-[hsl(38_92%_10%)]">
                        <span className="truncate">{field.label_vi}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={field.applicability === 'required' ? 'destructive' : 'secondary'} className="text-xs">
                            {field.applicability === 'required' ? '●' : '○'} {field.weight}pts
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matching Fields Tab */}
        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matching Layer (Lớp 1)</CardTitle>
              <CardDescription>
                Fields dùng cho search/filter/matching. Đây là dữ liệu mà KTS và AI Design Engine query.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {matchingRows.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
                    <dt className="text-sm text-muted-foreground shrink-0">{row.label}</dt>
                    <dd className="text-sm font-medium text-right flex items-center gap-1.5">
                      {row.hasSwatch && row.hex && <ColorSwatch hex={row.hex} size="sm" />}
                      <span className="capitalize">{row.value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              {sku.matching.style_tags.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <dt className="text-sm text-muted-foreground mb-2">Style Tags</dt>
                    <div className="flex flex-wrap gap-1.5">
                      {sku.matching.style_tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {sku.matching.space_type.length > 0 && (
                <div className="mt-3">
                  <dt className="text-sm text-muted-foreground mb-2">Space Types</dt>
                  <div className="flex flex-wrap gap-1.5">
                    {sku.matching.space_type.map((space) => (
                      <Badge key={space} variant="outline">{space}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Texture Diffuse', icon: ImageIcon, key: 'diffuse', required: true },
              { label: 'Product Image', icon: ImageIcon, key: 'photo', required: true },
              { label: 'Normal Map', icon: ImageIcon, key: 'normal', required: false },
              { label: 'Roughness Map', icon: ImageIcon, key: 'roughness', required: false },
              { label: 'AO Map', icon: ImageIcon, key: 'ao', required: false },
              { label: 'Room Photo', icon: ImageIcon, key: 'photo_room', required: false },
              { label: 'Spec Sheet PDF', icon: FileText, key: 'specsheet', required: false },
            ].map((asset) => {
              const has = asset.key === 'diffuse' || asset.key === 'photo';
              return (
                <Card key={asset.key} className={cn('overflow-hidden', !has && 'border-dashed')}>
                  <div className={cn(
                    'aspect-video flex items-center justify-center relative',
                    has ? 'bg-muted' : 'bg-muted/30'
                  )}>
                    {has && asset.key === 'diffuse' ? (
                      <div className="h-full w-full" style={{ backgroundColor: sku.matching.color_hex }} />
                    ) : (
                      <asset.icon className="h-8 w-8 text-muted-foreground/50" />
                    )}
                    {asset.required && (
                      <Badge className="absolute top-2 right-2 text-xs" variant={has ? 'success' : 'destructive'}>
                        {has ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {has ? 'Đã upload' : 'Bắt buộc'}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{asset.label}</span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {has ? 'Replace' : 'Upload'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Demand Tab */}
        <TabsContent value="demand" className="space-y-4">
          {demandSignal ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-muted-foreground">Lượt Spec</div>
                    <div className="text-3xl font-bold mt-1 tabular-nums">{demandSignal.spec_count}</div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <TrendingUp className={cn('h-3 w-3', demandSignal.trend === 'up' ? 'text-[hsl(142_71%_45%)]' : '')} />
                      <span className={demandSignal.trend === 'up' ? 'text-[hsl(142_71%_45%)]' : 'text-muted-foreground'}>
                        {demandSignal.spec_count_change > 0 ? '+' : ''}{demandSignal.spec_count_change}% vs tháng trước
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-muted-foreground">Khu vực hàng đầu</div>
                    <div className="text-2xl font-bold mt-1">{demandSignal.top_regions[0]?.region}</div>
                    <div className="text-xs text-muted-foreground mt-1">{demandSignal.top_regions[0]?.count} lượt spec</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-muted-foreground">Ứng dụng phổ biến</div>
                    <div className="text-2xl font-bold mt-1">{demandSignal.top_applications[0]?.application}</div>
                    <div className="text-xs text-muted-foreground mt-1">{demandSignal.top_applications[0]?.count} lần</div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Gợi ý nâng điểm</CardTitle>
                  <CardDescription>Tận dụng demand signal để tăng visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4">
                    <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{demandSignal.suggested_action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Điểm hiện tại: {completeness.score}% → Có thể đạt: {completeness.score + demandSignal.score_gap}%
                      </p>
                      <Button size="sm" className="mt-3">
                        <Edit className="h-3 w-3" /> Nâng điểm ngay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Chưa có demand signal cho SKU này
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <InfoTable title="System Metadata" icon={Shield} rows={systemRows} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
