'use client';

import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSocket } from '@/hooks/useSocket';
import { getUnreadCount } from '@/services/chat/chat';
import { getUnreadOrdersCount } from '@/services/order/order';
import { IUser } from '@/types';
import { MenuGroup, UserRole } from '@/types/admin-menu';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../../lib/logger';

interface DynamicMenuProps {
  menuGroups: MenuGroup[];
  role?: string;
  user?: IUser;
}

const DynamicMenu = ({ menuGroups, role, user }: DynamicMenuProps) => {
  const pathname = usePathname();
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      try {
        const res = await getUnreadCount();
        if (res.success) {
          setUnreadChatCount(res.data);
        }
      } catch (error) {
        logger.error('Failed to fetch unread chat count:', error);
      }
    }
  }, [role]);

  const fetchUnreadOrdersCount = useCallback(async () => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      try {
        const res = await getUnreadOrdersCount();
        if (res.success) {
          setUnreadOrderCount(res.data);
        }
      } catch (error) {
        logger.error('Failed to fetch unread orders count:', error);
      }
    }
  }, [role]);

  useEffect(() => {
    fetchUnreadCount();
    fetchUnreadOrdersCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchUnreadOrdersCount();
    }, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [role]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioCtx.currentTime + 0.5,
      );
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      logger.error('Audio play failed', e);
    }
  };

  const handleSocketUpdate = useCallback(() => {
    fetchUnreadCount();
  }, [role]);

  const lastBeep = useRef(0);
  const handleNewMessage = useCallback(() => {
    fetchUnreadCount();
    const now = Date.now();
    if (now - lastBeep.current > 1000) {
      lastBeep.current = now;
      playNotificationSound();
    }
  }, [role]);

  const handleOrderSocketUpdate = useCallback(() => {
    fetchUnreadOrdersCount();
  }, [role]);

  useSocket(
    handleSocketUpdate,
    user?._id,
    'new-notification',
    role === 'ADMIN' || role === 'SUPER_ADMIN' ? ['admins'] : [],
  );
  useSocket(handleSocketUpdate, user?._id, 'newNotification');
  useSocket(
    handleNewMessage,
    user?._id,
    'receive-message',
    role === 'ADMIN' || role === 'SUPER_ADMIN' ? ['admins'] : [],
  );
  useSocket(
    handleNewMessage,
    undefined,
    'new-user-message',
    role === 'ADMIN' || role === 'SUPER_ADMIN' ? ['admins'] : [],
  );
  useSocket(
    handleSocketUpdate,
    user?._id,
    'messages-marked-seen',
    role === 'ADMIN' || role === 'SUPER_ADMIN' ? ['admins'] : [],
  );
  useSocket(
    handleOrderSocketUpdate,
    undefined,
    'unread-orders-updated',
    role === 'ADMIN' || role === 'SUPER_ADMIN' ? ['admins'] : [],
  );

  const isLinkActive = (url: string) => {
    if (url === '/admin' || url === '/dashboard') return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  // Filter groups by role — if a group has no `roles`, it's visible to everyone
  const visibleGroups = menuGroups.filter((group) => {
    if (!group.roles || group.roles.length === 0) return true;
    if (!role) return false;
    const normalizedRole = role.toUpperCase();
    return group.roles.includes(normalizedRole as UserRole);
  });

  return (
    <>
      {visibleGroups.map((group, gi) => {
        // Filter items within the group too
        const visibleItems = group.menu.filter((item) => {
          if (!item.roles || item.roles.length === 0) return true;
          if (!role) return false;
          const normalizedRole = role.toUpperCase();
          return item.roles.includes(normalizedRole as UserRole);
        });

        if (visibleItems.length === 0) return null;

        return (
          <SidebarGroup key={gi}>
            {group.title && (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            )}

            <SidebarMenu>
              {visibleItems.map((menu, i) => {
                const hasSubMenu = menu.subMenu && menu.subMenu.length > 0;
                const active = isLinkActive(menu.url);

                // Inject dynamic badge for Support Center and Orders
                const displayBadge =
                  menu.name === 'Support Center'
                    ? unreadChatCount
                    : menu.name === 'Orders'
                      ? unreadOrderCount
                      : menu.badge;

                if (!hasSubMenu) {
                  return (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link href={menu.url}>
                          {menu.icon && <menu.icon />}
                          <span>{menu.name}</span>
                          {displayBadge !== undefined && displayBadge > 0 && (
                            <Badge className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] text-white">
                              {displayBadge > 9 ? '9+' : displayBadge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Collapsible menu with sub-items
                return (
                  <Collapsible
                    key={i}
                    className="group/collapsible"
                    defaultOpen={active}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild isActive={active}>
                          <div className="flex w-full items-center">
                            {menu.icon && <menu.icon />}
                            <span>{menu.name}</span>
                            {displayBadge !== undefined && displayBadge > 0 && (
                              <Badge className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] text-white">
                                {displayBadge > 9 ? '9+' : displayBadge}
                              </Badge>
                            )}
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {menu.subMenu
                            ?.filter((sub) => {
                              if (!sub.roles || sub.roles.length === 0)
                                return true;
                              if (!role) return false;
                              const normalizedRole = role.toUpperCase();
                              return sub.roles.includes(
                                normalizedRole as UserRole,
                              );
                            })
                            .map((subItem, j) => {
                              const subActive = isLinkActive(subItem.url);
                              return (
                                <SidebarMenuSubItem key={j} className="text-sm">
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={subActive}
                                  >
                                    <Link
                                      href={subItem.url}
                                      className="block rounded px-2 py-1"
                                    >
                                      {subItem.name}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
};

export default DynamicMenu;
