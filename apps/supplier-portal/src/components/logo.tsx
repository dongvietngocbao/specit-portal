import { cn } from '@/lib/utils';

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
        S
      </div>
      {showText && (
        <span className="font-semibold text-lg tracking-tight">
          Spec<span className="text-primary">It</span>
        </span>
      )}
    </div>
  );
}
