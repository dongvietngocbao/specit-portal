import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export function ScoreBadge({ score, size = 'default' }: { score: number; size?: 'sm' | 'default' }) {
  const getVariant = () => {
    if (score >= 90) return { variant: 'default' as const, label: '★★ Premium', className: 'bg-[hsl(262_52%_54%)]' };
    if (score >= 80) return { variant: 'default' as const, label: '★ Verified', className: 'bg-[hsl(250_60%_55%)]' };
    if (score >= 65) return { variant: 'info' as const, label: 'Active', className: '' };
    if (score >= 41) return { variant: 'warning' as const, label: 'Partial', className: '' };
    return { variant: 'destructive' as const, label: 'Draft', className: '' };
  };

  const { variant, label, className: badgeClass } = getVariant();

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
        score >= 90 ? 'bg-[hsl(262_52%_12%)] text-[hsl(262_52%_80%)] dark:bg-[hsl(262_52%_20%)]' :
        score >= 80 ? 'bg-[hsl(250_60%_12%)] text-[hsl(250_60%_80%)] dark:bg-[hsl(250_60%_20%)]' :
        score >= 65 ? 'bg-[hsl(199_89%_90%)] text-[hsl(199_89%_40%)] dark:bg-[hsl(199_89%_15%)] dark:text-[hsl(199_89%_70%)]' :
        score >= 41 ? 'bg-[hsl(38_92%_90%)] text-[hsl(38_92%_35%)] dark:bg-[hsl(38_92%_15%)] dark:text-[hsl(38_92%_70%)]' :
        'bg-[hsl(0_72%_90%)] text-[hsl(0_72%_40%)] dark:bg-[hsl(0_72%_15%)] dark:text-[hsl(0_72%_70%)]',
        size === 'sm' && 'text-[10px] px-1.5'
      )}>
        {score >= 90 && <Star className="h-3 w-3 fill-current" />}
        {score >= 80 && score < 90 && <Star className="h-3 w-3" />}
        {score}%
      </span>
      <Badge variant={variant} className={cn('hidden sm:inline-flex', badgeClass, size === 'sm' && 'text-[10px]')}>
        {label}
      </Badge>
    </div>
  );
}
