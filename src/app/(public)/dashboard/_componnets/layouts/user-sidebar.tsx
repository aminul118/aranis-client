'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import { logger } from '@/lib/logger';
import { logOut } from '@/services/auth/logout';
import type { IUser } from '@/services/user/user.interface';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { userSidebarMenu } from './user-menu';

const UserSidebar = ({
  user,
  logoUrl,
  variant = 'default',
}: {
  user: IUser;
  logoUrl?: string;
  variant?: 'default' | 'flush';
}) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logOut();
    } catch (error) {
      logger.error('Logout failed on server:', error);
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  const isLinkActive = (url: string) => {
    if (url === '/dashboard') return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
    (user as IUser)?.fullName;
  const initials = fullName
    ? fullName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a] ${
        variant === 'default'
          ? 'rounded-xl border border-gray-100 shadow-sm dark:border-white/10'
          : ''
      }`}
    >
      {/* Profile Info */}
      <div className="flex shrink-0 items-center gap-4 p-6">
        <Avatar className="h-14 w-14 border border-gray-200 dark:border-white/10">
          <AvatarImage
            src={user?.picture || ''}
            alt={fullName || 'User'}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100 font-bold text-gray-900 dark:bg-white/10 dark:text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900 uppercase dark:text-white">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.phone || user?.email}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="scrollbar-small flex flex-1 flex-col overflow-y-auto px-4 pb-4">
        {userSidebarMenu[0].menu.map((item, index) => {
          const active = isLinkActive(item.url);
          return (
            <Link
              key={index}
              href={item.url}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'rounded-l-none border-l-4 border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${active ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-auto shrink-0 p-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full rounded-lg bg-[#DE1D24] px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
