'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Trigger will be handled by parent header */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className={cn('absolute left-0 top-0 h-full w-72 animate-slide-in-right')}>
            <Button variant="ghost" size="icon-sm" className="absolute right-2 top-2 z-10" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
