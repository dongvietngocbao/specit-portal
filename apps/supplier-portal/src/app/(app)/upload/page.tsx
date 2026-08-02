'use client';

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Upload, FileText, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2,
  Sparkles, ArrowRight, RefreshCw, Eye, Trash2, FileCheck2, ChevronRight,
} from 'lucide-react';
import { MOCK_EXTRACTION_RESULT } from '@/lib/mock/extraction';
import { MATERIAL_TYPES } from '@specit/canonical-schema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

type UploadPhase = 'idle' | 'uploading' | 'extracting' | 'review' | 'done';

export default function UploadPage() {
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'excel'>('pdf');
  const [materialHint, setMaterialHint] = useState('ceramic_tile');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startExtraction = useCallback((name: string, type: 'pdf' | 'excel') => {
    setFileName(name);
    setFileType(type);
    setPhase('uploading');
    setUploadProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(uploadInterval);
          setPhase('extracting');
          setExtractionProgress(0);
          // Simulate AI extraction
          const extractInterval = setInterval(() => {
            setExtractionProgress((p) => {
              if (p >= 100) {
                clearInterval(extractInterval);
                setPhase('review');
                toast.success('AI extraction hoàn tất', { description: `${MOCK_EXTRACTION_RESULT.drafts.length} SKU drafts found` });
                return 100;
              }
              return p + Math.random() * 12;
            });
          }, 300);
          return 100;
        }
        return p + Math.random() * 18;
      });
    }, 250);
  }, []);

  const handleFileSelect = (file: File) => {
    const isPdf = file.name.endsWith('.pdf');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
    if (!isPdf && !isExcel) {
      toast.error('File không hợp lệ', { description: 'Vui lòng upload PDF hoặc Excel' });
      return;
    }
    startExtraction(file.name, isPdf ? 'pdf' : 'excel');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleReset = () => {
    setPhase('idle');
    setUploadProgress(0);
    setExtractionProgress(0);
    setFileName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload catalog PDF hoặc Excel danh sách SKU — AI extract tự động
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 text-sm">
        {[
          { id: 'idle', label: 'Upload File', n: 1 },
          { id: 'extracting', label: 'AI Extract', n: 2 },
          { id: 'review', label: 'Review Drafts', n: 3 },
          { id: 'done', label: 'Publish', n: 4 },
        ].map((step, idx) => {
          const active = phase === step.id || (phase === 'uploading' && step.id === 'idle') || (phase === 'review' && step.id === 'review') || (phase === 'done' && step.id === 'done');
          const completed = (phase === 'extracting' && step.n < 2) || (phase === 'review' && step.n < 3) || (phase === 'done');
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                completed ? 'bg-primary text-primary-foreground' :
                active ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                'bg-muted text-muted-foreground'
              )}>
                {completed ? <CheckCircle2 className="h-4 w-4" /> : step.n}
              </div>
              <span className={cn(active || completed ? 'font-medium' : 'text-muted-foreground', 'hidden sm:inline')}>
                {step.label}
              </span>
              {idx < 3 && <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />}
            </div>
          );
        })}
      </div>

      {/* IDLE: Drop zone */}
      {phase === 'idle' && (
        <>
          <Card>
            <CardContent className="p-0">
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer',
                  dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-muted/30'
                )}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Kéo thả file vào đây</p>
                    <p className="text-sm text-muted-foreground mt-1">hoặc click để chọn file</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="gap-1"><FileText className="h-3 w-3" /> PDF Catalog</Badge>
                    <Badge variant="secondary" className="gap-1"><FileSpreadsheet className="h-3 w-3" /> Excel/CSV</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 50MB · PDF up to 100 pages · Excel/CSV auto column-mapping
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Material type hint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gợi ý loại vật liệu</CardTitle>
              <CardDescription>Chọn loại VL để tăng độ chính xác AI extract</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={materialHint} onValueChange={setMaterialHint}>
                <SelectTrigger className="w-full sm:w-72">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_TYPES.filter(t => t.mvp_priority).map((type) => (
                    <SelectItem key={type.material_type_id} value={type.material_type_id}>
                      {type.name_vi} ({type.name_en})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Quick demo buttons */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-3 text-center">Demo nhanh — chọn file mẫu:</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => startExtraction('viglacera_catalog_q3_2026.pdf', 'pdf')}>
                  <FileText className="h-4 w-4" /> PDF Catalog Demo
                </Button>
                <Button variant="outline" onClick={() => startExtraction('viglacera_price_list_aug2026.xlsx', 'excel')}>
                  <FileSpreadsheet className="h-4 w-4" /> Excel Price List Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* UPLOADING */}
      {phase === 'uploading' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {fileType === 'pdf' ? <FileText className="h-8 w-8 text-primary" /> : <FileSpreadsheet className="h-8 w-8 text-primary" />}
              <span className="text-lg font-medium">{fileName}</span>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Đang upload...</span>
                <span className="tabular-nums">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* EXTRACTING */}
      {phase === 'extracting' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">AI đang extract dữ liệu...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  OCR + parse + map vào canonical schema
                </p>
              </div>
              <div className="max-w-md w-full space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Extraction</span>
                  <span className="tabular-nums">{Math.round(extractionProgress)}%</span>
                </div>
                <Progress value={extractionProgress} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mt-4">
                <div className={cn('flex items-center gap-1', extractionProgress > 30 && 'text-[hsl(142_71%_45%)]')}>
                  {extractionProgress > 30 ? <CheckCircle2 className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                  OCR Parse
                </div>
                <div className={cn('flex items-center gap-1', extractionProgress > 60 && 'text-[hsl(142_71%_45%)]')}>
                  {extractionProgress > 60 ? <CheckCircle2 className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                  Schema Map
                </div>
                <div className={cn('flex items-center gap-1', extractionProgress > 90 && 'text-[hsl(142_71%_45%)]')}>
                  {extractionProgress > 90 ? <CheckCircle2 className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                  Dedupe
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* REVIEW: Show extraction drafts */}
      {phase === 'review' && (
        <div className="space-y-4">
          {/* Extraction summary */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Extract hoàn tất — {MOCK_EXTRACTION_RESULT.drafts.length} SKU drafts</p>
                    <p className="text-xs text-muted-foreground">
                      Overall confidence: {MOCK_EXTRACTION_RESULT.extraction_confidence}% · Extraction ID: {MOCK_EXTRACTION_RESULT.raw_extraction_id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RefreshCw className="h-3 w-3" /> Upload khác
                  </Button>
                  <Button size="sm" onClick={() => { setPhase('done'); toast.success('SKU đã publish!'); }}>
                    Publish tất cả <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Draft cards */}
          {MOCK_EXTRACTION_RESULT.drafts.map((draft, idx) => {
            const fieldEntries = Object.entries(draft.fields);
            const highConfidence = fieldEntries.filter(([, v]) => (v as any).confidence >= 0.9).length;
            const mediumConfidence = fieldEntries.filter(([, v]) => (v as any).confidence >= 0.7 && (v as any).confidence < 0.9).length;
            const lowConfidence = fieldEntries.filter(([, v]) => (v as any).confidence < 0.7).length;

            return (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {idx + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base">{(draft.fields as any).product_name?.value || `Draft ${idx + 1}`}</CardTitle>
                        <CardDescription className="text-xs">
                          {draft.material_type} · {fieldEntries.length} fields extracted
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="gap-1 bg-[hsl(142_71%_90%)] text-[hsl(142_71%_40%)] dark:bg-[hsl(142_71%_15%)] dark:text-[hsl(142_71%_65%)]">
                        <CheckCircle2 className="h-3 w-3" /> {highConfidence}
                      </Badge>
                      {mediumConfidence > 0 && (
                        <Badge variant="secondary" className="gap-1 bg-[hsl(38_92%_90%)] text-[hsl(38_92%_40%)] dark:bg-[hsl(38_92%_15%)] dark:text-[hsl(38_92%_70%)]">
                          {mediumConfidence}
                        </Badge>
                      )}
                      {lowConfidence > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" /> {lowConfidence}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {fieldEntries.map(([fieldName, fieldData]) => {
                      const data = fieldData as any;
                      const confidenceColor =
                        data.confidence >= 0.9 ? 'text-[hsl(142_71%_45%)]' :
                        data.confidence >= 0.7 ? 'text-[hsl(38_92%_50%)]' :
                        'text-destructive';
                      return (
                        <div key={fieldName} className="flex items-start justify-between gap-2 text-sm border-b border-border/30 py-1.5">
                          <span className="text-muted-foreground capitalize shrink-0">{fieldName.replace(/_/g, ' ')}</span>
                          <div className="text-right">
                            <div className="font-medium">{String(data.value)}</div>
                            <div className={cn('text-xs flex items-center justify-end gap-1', confidenceColor)}>
                              {Math.round(data.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm"><Eye className="h-3 w-3" /> Preview</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-3 w-3" /> Discard</Button>
                    <Button size="sm"><FileCheck2 className="h-3 w-3" /> Approve & Create</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* DONE */}
      {phase === 'done' && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(142_71%_90%)] dark:bg-[hsl(142_71%_15%)]">
                <CheckCircle2 className="h-10 w-10 text-[hsl(142_71%_45%)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">SKU đã publish!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {MOCK_EXTRACTION_RESULT.drafts.length} SKU mới đã được thêm vào registry
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" asChild>
                  <Link href="/skus">Xem trong SKU Management</Link>
                </Button>
                <Button onClick={handleReset}><Upload className="h-4 w-4" /> Upload thêm</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
