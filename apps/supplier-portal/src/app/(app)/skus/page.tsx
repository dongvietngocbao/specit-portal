'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/score-badge';
import { StatusBadge } from '@/components/status-badge';
import { ColorSwatch } from '@/components/color-swatch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Package, Search, Plus, Filter, Download, LayoutGrid, List, ArrowUpDown,
} from 'lucide-react';
import { MOCK_SKUS } from '@/lib/mock/skus';
import { MATERIAL_TYPES } from '@specit/canonical-schema';
import { formatCurrency, cn } from '@/lib/utils';
import { EmptyState } from '@/components/empty-state';

type SortField = 'completeness_score' | 'product_name' | 'price_value' | 'created_at';
type SortDir = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

export default function SkusPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('completeness_score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filtered = useMemo(() => {
    let result = MOCK_SKUS.filter((sku) => {
      const matchSearch = !search ||
        sku.product_name.toLowerCase().includes(search.toLowerCase()) ||
        sku.sku_id.toLowerCase().includes(search.toLowerCase()) ||
        sku.brand.toLowerCase().includes(search.toLowerCase()) ||
        (sku.collection_name || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || sku.status === statusFilter;
      const matchType = typeFilter === 'all' || sku.material_type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });

    result = result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'completeness_score':
          cmp = a.system.completeness_score - b.system.completeness_score;
          break;
        case 'product_name':
          cmp = a.product_name.localeCompare(b.product_name);
          break;
        case 'price_value':
          cmp = (a.commercial.price_value || 0) - (b.commercial.price_value || 0);
          break;
        case 'created_at':
          cmp = new Date(a.system.created_at).getTime() - new Date(b.system.created_at).getTime();
          break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [search, statusFilter, typeFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SKU Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {MOCK_SKUS.length} SKU · {MOCK_SKUS.filter((s) => s.status === 'active').length} active · {MOCK_SKUS.filter((s) => s.status === 'partial').length} partial
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" asChild>
            <Link href="/upload"><Plus className="h-4 w-4" /> Thêm SKU</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, SKU code, brand, collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Loại vật liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {MATERIAL_TYPES.filter((t) => t.mvp_priority).map((type) => (
                  <SelectItem key={type.material_type_id} value={type.material_type_id}>
                    {type.name_vi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 rounded-md border p-0.5">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Package}
              title="Không tìm thấy SKU"
              description="Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm"
              action={<Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}>Xoá bộ lọc</Button>}
            />
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((sku) => (
            <Link key={sku.id} href={`/skus/${sku.id}`}>
              <Card className="overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full group">
                {/* Thumbnail */}
                <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: sku.matching.color_hex,
                      opacity: 0.15,
                    }}
                  />
                  <div
                    className="h-24 w-24 rounded-xl shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: sku.matching.color_hex }}
                  />
                  <div className="absolute top-2 right-2">
                    <ScoreBadge score={sku.system.completeness_score} size="sm" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <StatusBadge status={sku.status} />
                  </div>
                </div>
                {/* Info */}
                <CardContent className="p-4 space-y-2">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{sku.product_name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{sku.sku_id}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <ColorSwatch hex={sku.matching.color_hex} size="sm" />
                    <span className="text-muted-foreground capitalize">{sku.matching.finish}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{sku.dimension.width_mm}×{sku.dimension.height_mm}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold tabular-nums text-sm">
                      {formatCurrency(sku.commercial.price_value || 0)}/{sku.commercial.price_unit}
                    </span>
                    {sku.matching.style_tags.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {sku.matching.style_tags[0]}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('product_name')}>
                      Sản phẩm <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">SKU Code</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Kích thước</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Hoàn thiện</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground ml-auto" onClick={() => toggleSort('price_value')}>
                      Giá/m² <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-center p-3 font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground mx-auto" onClick={() => toggleSort('completeness_score')}>
                      Điểm <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sku) => (
                  <tr key={sku.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="p-3">
                      <Link href={`/skus/${sku.id}`} className="flex items-center gap-3">
                        <ColorSwatch hex={sku.matching.color_hex} size="sm" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{sku.product_name}</div>
                          <div className="text-xs text-muted-foreground">{sku.brand} · {sku.collection_name}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{sku.sku_id}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">
                      {sku.dimension.width_mm}×{sku.dimension.height_mm}×{sku.dimension.thickness_mm}mm
                    </td>
                    <td className="p-3 text-muted-foreground capitalize hidden lg:table-cell">{sku.matching.finish}</td>
                    <td className="p-3 text-right font-medium tabular-nums">
                      {formatCurrency(sku.commercial.price_value || 0)}
                    </td>
                    <td className="p-3 text-center">
                      <ScoreBadge score={sku.system.completeness_score} size="sm" />
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={sku.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
