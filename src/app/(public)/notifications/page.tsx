'use client';

import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import {
  clearAll,
  deleteOneNotification,
  getMyNotifications,
  INotification,
  markAllAsRead,
  markAsRead,
} from '@/services/notification/notification';
import { getMe } from '@/services/user/users';
import { IUser } from '@/types';
import {
  Bell,
  CheckCircle,
  CreditCard,
  Heart,
  MessageSquare,
  Package,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { logger } from '../../../lib/logger';

const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'Order':
      return {
        icon: Package,
        colorClass:
          'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/20',
        label: 'Order',
      };
    case 'Chat':
      return {
        icon: MessageSquare,
        colorClass:
          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20',
        label: 'Chat',
      };
    case 'Payment':
      return {
        icon: CreditCard,
        colorClass:
          'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20',
        label: 'Payment',
      };
    case 'Wishlist':
      return {
        icon: Heart,
        colorClass:
          'bg-pink-500/10 text-pink-500 border-pink-500/20 dark:bg-pink-500/20',
        label: 'Wishlist',
      };
    case 'Restock':
      return {
        icon: RefreshCw,
        colorClass:
          'bg-purple-500/10 text-purple-500 border-purple-500/20 dark:bg-purple-500/20',
        label: 'Restock',
      };
    default:
      return {
        icon: Bell,
        colorClass:
          'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 dark:bg-zinc-500/20',
        label: 'System',
      };
  }
};

const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

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
      logger.error('Failed to fetch notifications:', error);
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
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? ['admins'] : [],
  );

  useSocket(
    handleSocketNotification,
    user?._id || user?.userId?.toString(),
    'order-status-updated',
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

  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteOneNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    toast.success('Notification removed');
  };

  const handleNotificationClick = async (notif: INotification) => {
    if (!notif.isRead) {
      await handleMarkAsRead(notif._id);
    }

    const role = user?.role;
    const isChat = notif.type === 'Chat';
    const isOrder = notif.type === 'Order';
    const isRestock = notif.type === 'Restock';
    const isWishlist = notif.type === 'Wishlist';

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      if (isChat) {
        router.push(
          `/admin/chat${notif.conversationId ? `?conversationId=${notif.conversationId}` : ''}`,
        );
      } else if (isOrder) {
        router.push(`/admin/orders${notif.orderId ? `/${notif.orderId}` : ''}`);
      } else if (isRestock) {
        router.push('/admin/restock-requests');
      } else if (isWishlist) {
        router.push('/admin/products');
      } else if (notif.link) {
        router.push(notif.link);
      }
    } else {
      // Regular User
      if (isChat) {
        router.push('/user/chat');
      } else if (isOrder) {
        router.push('/user/orders');
      } else if (notif.link) {
        router.push(notif.link);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-600">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex gap-4">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase transition-all hover:underline"
              >
                <CheckCircle size={14} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAllInternal}
                className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase transition-all hover:underline"
              >
                <Trash2 size={14} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="space-y-3.5">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const config = getNotificationConfig(notif.type);
              const IconComp = config.icon;

              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    'group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-lg',
                    notif.isRead
                      ? 'bg-muted/10 border-border/40 hover:bg-muted/20 opacity-70'
                      : 'bg-card border-blue-500/15 shadow-sm shadow-blue-500/5 hover:border-blue-500/30',
                  )}
                >
                  {/* Left Icon Badge */}
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-transparent transition-all group-hover:scale-105',
                      config.colorClass,
                    )}
                  >
                    <IconComp size={20} strokeWidth={2.5} />
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 space-y-1 pr-6">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                      <h3 className="text-sm leading-snug font-black tracking-tight sm:text-base">
                        {notif.title}
                      </h3>
                      <span className="text-muted-foreground/50 shrink-0 text-[10px] font-bold uppercase">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium sm:text-sm">
                      {notif.message}
                    </p>
                  </div>

                  {/* Single Delete Action */}
                  <button
                    onClick={(e) => handleDeleteOne(e, notif._id)}
                    className="text-muted-foreground/20 absolute top-5 right-5 flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="border-border bg-card flex flex-col items-center justify-center rounded-3xl border py-24 text-center shadow-sm">
              <div className="bg-muted/40 mb-5 flex h-24 w-24 items-center justify-center rounded-3xl">
                <Bell className="text-muted-foreground/20 h-10 w-10" />
              </div>
              <h2 className="mb-1 text-2xl font-black tracking-tight uppercase">
                All caught up!
              </h2>
              <p className="text-muted-foreground text-sm font-semibold">
                No new notifications at the moment.
              </p>
              <p className="text-muted-foreground/40 mt-1 text-xs">
                We'll let you know when there's an update regarding your order,
                chat, or system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
