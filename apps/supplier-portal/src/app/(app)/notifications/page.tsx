import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell, TrendingUp, AlertTriangle, CheckCircle2, FileText, Store,
  Check, CheckCheck,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mock/notifications';
import { timeAgo, cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotificationsPage() {
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const iconMap = { demand: TrendingUp, completeness: AlertTriangle, review: CheckCircle2, dealer: Store, system: FileText };
  const colorMap = {
    demand: 'bg-primary/10 text-primary',
    completeness: 'bg-[hsl(38_92%_90%)] text-[hsl(38_92%_40%)] dark:bg-[hsl(38_92%_15%)] dark:text-[hsl(38_92%_70%)]',
    review: 'bg-[hsl(142_71%_90%)] text-[hsl(142_71%_40%)] dark:bg-[hsl(142_71%_15%)] dark:text-[hsl(142_71%_65%)]',
    dealer: 'bg-[hsl(199_89%_90%)] text-[hsl(199_89%_40%)] dark:bg-[hsl(199_89%_15%)] dark:text-[hsl(199_89%_65%)]',
    system: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {MOCK_NOTIFICATIONS.length} thông báo · {unread} chưa đọc
          </p>
        </div>
        <Button variant="outline" size="sm"><CheckCheck className="h-4 w-4" /> Đánh dấu tất cả đã đọc</Button>
      </div>

      <div className="space-y-2">
        {MOCK_NOTIFICATIONS.map(notif => {
          const Icon = iconMap[notif.type] || Bell;
          return (
            <Card key={notif.id} className={cn(!notif.read && 'border-primary/30 bg-primary/5')}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-full shrink-0', colorMap[notif.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                      </div>
                      {!notif.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{timeAgo(notif.created_at)}</span>
                      {notif.action_url && (
                        <Link href={notif.action_url} className="text-xs text-primary hover:underline">
                          Xem chi tiết →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
