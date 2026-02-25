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
import { Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  user: any;
}

const NotificationBell = ({ user }: Props) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getMyNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds as fallback
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleSocketNotification = useCallback(
    (data: any) => {
      // Refresh from server to get the official persistent notification ID and data
      fetchNotifications();

      toast.info(data.title || 'Notification', {
        description: data.message,
      });
    },
    [fetchNotifications],
  );

  // Listen for all notifications globally
  useSocket(
    handleSocketNotification,
    user?._id || user?.userId,
    'new-notification',
    user?.role === 'ADMIN' ? ['admins'] : [],
  );
  useSocket(
    handleSocketNotification,
    user?._id || user?.userId,
    'newNotification',
  );
  useSocket(handleSocketNotification, undefined, 'order-status-updated');

  // Sync with chat status
  useSocket(
    () => {
      fetchNotifications();
    },
    user?._id || user?.userId,
    'receive-message',
    user?.role === 'ADMIN' ? ['admins'] : [],
  );

  useSocket(
    (data) => {
      // If messages in a conversation are marked seen, refresh our notification list
      // to clear the related chat notifications
      fetchNotifications();
    },
    user?._id || user?.userId,
    'messages-marked-seen',
    user?.role === 'ADMIN' ? ['admins'] : [],
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
  };

  const handleClearAllInternal = async () => {
    await clearAll();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="group hover:bg-accent relative cursor-pointer rounded-full p-2 transition-colors">
      <Bell className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white transition-all">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {/* Notifications Dropdown */}
      <div className="bg-popover invisible absolute top-full right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border p-4 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
        <div className="mb-2 flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold">Notifications</h4>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-primary text-[10px] hover:underline"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAllInternal}
                className="text-muted-foreground hover:text-destructive text-[10px] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        <div className="scrollbar-hide max-h-80 space-y-3 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors',
                  notif.isRead
                    ? 'hover:bg-muted/30 opacity-60'
                    : 'bg-primary/5 hover:bg-primary/10',
                )}
              >
                {!notif.isRead && (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                )}
                <div className={cn(!notif.isRead ? '' : 'ml-5')}>
                  <p className="text-xs font-semibold">{notif.title}</p>
                  <p className="text-muted-foreground text-[10px] leading-tight">
                    {notif.message}
                  </p>
                  <p className="text-muted-foreground/60 mt-1 text-[9px] font-medium uppercase">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Bell className="text-muted-foreground/20 mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-xs">
                No new notifications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
