'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { NAV_SECTIONS } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
      </div>

      {/* Workspace selector */}
      <div className="px-3 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-sidebar-accent/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-xs">
            VG
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium truncate">Viglacera</span>
              <Shield className="h-3 w-3 text-[hsl(142_71%_45%)]" />
            </div>
            <span className="text-xs text-muted-foreground">Tier 1 · Verified</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
          <div className="flex h-2 w-2 rounded-full bg-[hsl(142_71%_45%)] animate-pulse" />
          <span>Spec Engine: Connected</span>
        </div>
      </div>
    </aside>
  );
}
