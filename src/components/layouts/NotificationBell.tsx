'use client';

import { playNotificationSound } from '@/helpers/audio';
import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import { getUnreadCount } from '@/services/chat/chat';
import {
  clearAll,
  deleteOneNotification,
  getMyNotifications,
  INotification,
  markAllAsRead,
  markAsRead,
} from '@/services/notification/notification';
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
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { logger } from '../../lib/logger';

interface Props {
  user: any;
}

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

const NotificationBell = ({ user }: Props) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchChatCount = useCallback(async () => {
    try {
      const res = await getUnreadCount();
      if (res?.success) setUnreadChatCount(res.data || 0);
    } catch (error) {
      logger.error('Failed to fetch unread chat count:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getMyNotifications();
      setNotifications(data || []);
    } catch (error) {
      logger.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchChatCount();
    // Poll every 60 seconds as fallback
    const interval = setInterval(() => {
      fetchNotifications();
      fetchChatCount();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchChatCount]);

  const handleSocketNotification = useCallback(
    (data: any) => {
      fetchNotifications();

      const isChat = data.type === 'Chat';

      if (isChat) {
        fetchChatCount();
        if (pathname.includes('/chat')) {
          return; // Do nothing if already in chat tab
        }
        playNotificationSound(); // Only play sound, no toast
      } else {
        playNotificationSound();
        toast.info(data.title || 'Notification', {
          id: data._id || data.orderId || JSON.stringify(data),
          description: data.message,
        });
      }
    },
    [fetchNotifications, fetchChatCount, pathname],
  );

  // Listen for all notifications globally
  useSocket(
    handleSocketNotification,
    user?._id || user?.userId,
    'new-notification',
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? ['admins'] : [],
  );
  useSocket(
    handleSocketNotification,
    user?._id || user?.userId,
    'newNotification',
  );
  useSocket(
    handleSocketNotification,
    user?._id || user?.userId,
    'order-status-updated',
  );

  // Sync with chat status
  useSocket(
    (data: any) => {
      fetchNotifications();
      fetchChatCount();
      if (!pathname.includes('/chat')) {
        // Redundant manual toast removed since backend emits new-notification
      }
    },
    user?._id || user?.userId,
    'receive-message',
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? ['admins'] : [],
  );

  useSocket(
    (data: any) => {
      fetchChatCount();
      if (!pathname.includes('/chat')) {
        // Redundant manual toast removed since backend emits new-notification
      }
    },
    user?._id || user?.userId,
    'new-user-message',
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? ['admins'] : [],
  );

  useSocket(
    () => {
      fetchNotifications();
      fetchChatCount();
    },
    user?._id || user?.userId,
    'messages-marked-seen',
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? ['admins'] : [],
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

    setIsOpen(false);

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
        router.push('/dashboard/chat');
      } else if (isOrder) {
        router.push('/dashboard/orders');
      } else if (notif.link) {
        router.push(notif.link);
      } else {
        router.push('/notifications');
      }
    }
  };

  const handleBellClick = () => {
    if (window.innerWidth < 1024) {
      router.push('/notifications');
    } else {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as Element).closest('.notification-container')
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalUnread = unreadCount + unreadChatCount;

  return (
    <div className="notification-container relative">
      <div
        onClick={handleBellClick}
        className={cn(
          'hover:bg-accent relative cursor-pointer rounded-full p-2 transition-colors',
          isOpen && 'bg-accent',
        )}
      >
        <Bell
          className={cn(
            'h-5 w-5 transition-colors',
            isOpen ? 'text-primary' : 'text-zinc-400 group-hover:text-white',
          )}
        />
        {totalUnread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white transition-all">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </div>

      {/* Notifications Dropdown */}
      <div
        className={cn(
          'bg-popover/95 border-border absolute top-full right-0 z-50 mt-3 w-96 origin-top-right rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0',
        )}
      >
        <div className="mb-3 flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black tracking-tight uppercase">
              Notifications
            </h4>
            {totalUnread > 0 && (
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-black text-blue-600">
                {totalUnread} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                className="flex items-center gap-1 text-[10px] font-extrabold text-blue-600 uppercase hover:underline"
              >
                <CheckCircle size={10} />
                <span>Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAllInternal();
                }}
                className="flex items-center gap-1 text-[10px] font-extrabold text-red-500 uppercase hover:underline"
              >
                <Trash2 size={10} />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>

        <div className="scrollbar-hide max-h-80 space-y-2.5 overflow-y-auto">
          {unreadChatCount > 0 && (
            <div
              onClick={() =>
                router.push(
                  user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
                    ? '/admin/chat'
                    : '/dashboard/chat',
                )
              }
              className="group relative flex cursor-pointer items-start gap-3.5 rounded-xl border border-emerald-500/10 bg-emerald-600/[0.05] p-3 transition-all hover:bg-emerald-600/[0.08]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 transition-all group-hover:scale-105">
                <MessageSquare size={16} strokeWidth={2.5} />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-foreground text-xs leading-snug font-black tracking-tight">
                    Unread Chat Messages
                  </p>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-[10px] leading-normal font-medium">
                  You have {unreadChatCount} unread message
                  {unreadChatCount > 1 ? 's' : ''} in your chat. Click here to
                  view.
                </p>
              </div>
            </div>
          )}

          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const config = getNotificationConfig(notif.type);
              const IconComp = config.icon;

              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    'group relative flex cursor-pointer items-start gap-3.5 rounded-xl border border-transparent p-3 transition-all',
                    notif.isRead
                      ? 'bg-muted/10 hover:bg-muted/20 opacity-60'
                      : 'border-blue-500/10 bg-blue-600/[0.02] hover:bg-blue-600/[0.04]',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent transition-all group-hover:scale-105',
                      config.colorClass,
                    )}
                  >
                    <IconComp size={16} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-foreground text-xs leading-snug font-black tracking-tight">
                        {notif.title}
                      </p>
                      <span className="text-muted-foreground/50 shrink-0 text-[9px] font-bold uppercase">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-[10px] leading-normal font-medium">
                      {notif.message}
                    </p>
                  </div>

                  {/* Inline Delete Button */}
                  <button
                    onClick={(e) => handleDeleteOne(e, notif._id)}
                    className="text-muted-foreground/20 absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                    title="Delete Notification"
                    aria-label="Delete Notification"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted/30 mb-3 flex h-14 w-14 items-center justify-center rounded-2xl">
                <Bell className="text-muted-foreground/30 h-6 w-6" />
              </div>
              <p className="text-muted-foreground text-xs font-bold">
                No new notifications
              </p>
              <p className="text-muted-foreground/40 mt-0.5 text-[9px]">
                We will notify you when something happens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
