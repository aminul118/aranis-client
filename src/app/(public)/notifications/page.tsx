'use client';

import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import {
  clearAll,
  getMyNotifications,
  INotification,
  markAllAsRead,
  markAsRead,
} from '@/services/notification/notification';
import { getMe } from '@/services/user/users';
import { IUser } from '@/types';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getMyNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        if (data) {
          setUser(data);
          fetchNotifications();
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [fetchNotifications, router]);

  const handleSocketNotification = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useSocket(
    handleSocketNotification,
    user?._id || user?.userId?.toString(),
    'new-notification',
  );

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleClearAllInternal = async () => {
    await clearAll();
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tighter">
            Notifications
          </h1>
          <div className="flex gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
              >
                <CheckCircle2 size={14} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAllInternal}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:underline"
              >
                <Trash2 size={14} /> Clear all
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                className={cn(
                  'group border-border relative flex cursor-pointer flex-col gap-2 rounded-2xl border p-5 transition-all hover:shadow-md',
                  notif.isRead
                    ? 'bg-muted/20 opacity-70'
                    : 'bg-card border-blue-500/20 shadow-sm shadow-blue-500/5',
                )}
              >
                {!notif.isRead && (
                  <div className="absolute top-5 left-2 h-2 w-2 rounded-full bg-blue-500" />
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm leading-tight font-bold">
                      {notif.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  <span className="text-muted-foreground/60 shrink-0 text-[10px] font-medium uppercase">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <Bell className="text-muted-foreground/20 h-10 w-10" />
              </div>
              <h2 className="mb-2 text-xl font-bold">All caught up!</h2>
              <p className="text-muted-foreground text-sm">
                No new notifications at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
