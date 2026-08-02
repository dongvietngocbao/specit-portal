import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, FileText, Search, Filter, Grid3x3, FolderOpen } from 'lucide-react';
import { MOCK_SKUS } from '@/lib/mock/skus';
import { cn } from '@/lib/utils';

export default function MediaLibraryPage() {
  const mediaItems = MOCK_SKUS.flatMap(sku => {
    const items: { sku: string; name: string; type: string; color: string; size: string; has: boolean }[] = [
      { sku: sku.sku_id, name: `${sku.product_name} - Diffuse`, type: 'Texture', color: sku.matching.color_hex, size: '2048×2048', has: !!sku.matching.color_hex },
      { sku: sku.sku_id, name: `${sku.product_name} - Photo`, type: 'Photo', color: sku.matching.color_hex, size: '1024×1024', has: !!sku.matching.color_hex },
      { sku: sku.sku_id, name: `${sku.product_name} - Normal`, type: 'Texture', color: '#808080', size: '2048×2048', has: false },
      { sku: sku.sku_id, name: `${sku.product_name} - Roughness`, type: 'Texture', color: '#444444', size: '2048×2048', has: false },
    ];
    return items;
  });

  const stats = {
    total: mediaItems.length,
    uploaded: mediaItems.filter(m => m.has).length,
    missing: mediaItems.filter(m => !m.has).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý texture, hình ảnh, và tài liệu cho SKU
          </p>
        </div>
        <Button><Upload className="h-4 w-4" /> Upload Media</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Total Assets</div>
          <div className="text-2xl font-bold tabular-nums">{stats.total}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Đã upload</div>
          <div className="text-2xl font-bold tabular-nums text-[hsl(142_71%_45%)]">{stats.uploaded}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Cần bổ sung</div>
          <div className="text-2xl font-bold tabular-nums text-[hsl(38_92%_50%)]">{stats.missing}</div>
        </CardContent></Card>
      </div>

      {/* Filter bar */}
      <Card><CardContent className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm" placeholder="Tìm media..." />
          </div>
          {['All', 'Texture', 'Photo', 'PDF'].map((f, i) => (
            <Button key={f} variant={i === 0 ? 'secondary' : 'ghost'} size="sm">{f}</Button>
          ))}
        </div>
      </CardContent></Card>

      {/* Media grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mediaItems.slice(0, 20).map((item, idx) => (
          <Card key={idx} className={cn('overflow-hidden group', !item.has && 'border-dashed opacity-60')}>
            <div className="aspect-square relative bg-muted flex items-center justify-center">
              {item.has ? (
                <div className="absolute inset-0 transition-transform group-hover:scale-105" style={{ backgroundColor: item.color }} />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={item.has ? 'success' : 'secondary'} className="text-xs">
                  {item.has ? 'Ready' : 'Missing'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span>{item.type}</span>
                <span>{item.size}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
