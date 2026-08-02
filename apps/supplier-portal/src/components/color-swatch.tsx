import { cn } from '@/lib/utils';

export function ColorSwatch({ hex, size = 'default', className }: { hex: string; size?: 'sm' | 'default' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  return (
    <div
      className={cn('inline-block rounded-md border border-border shadow-sm', sizes[size], className)}
      style={{ backgroundColor: hex }}
      title={hex}
    />
  );
}
