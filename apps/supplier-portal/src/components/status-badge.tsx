import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variants: Record<string, string> = {
    active: 'bg-[hsl(142_71%_90%)] text-[hsl(142_71%_30%)] dark:bg-[hsl(142_71%_15%)] dark:text-[hsl(142_71%_65%)]',
    partial: 'bg-[hsl(38_92%_90%)] text-[hsl(38_92%_35%)] dark:bg-[hsl(38_92%_15%)] dark:text-[hsl(38_92%_70%)]',
    draft: 'bg-[hsl(0_72%_90%)] text-[hsl(0_72%_40%)] dark:bg-[hsl(0_72%_15%)] dark:text-[hsl(0_72%_70%)]',
    discontinued: 'bg-muted text-muted-foreground',
  };

  const labels: Record<string, string> = {
    active: 'Active',
    partial: 'Partial',
    draft: 'Draft',
    discontinued: 'Discontinued',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      variants[status] || variants.draft,
      className
    )}>
      {labels[status] || status}
    </span>
  );
}
