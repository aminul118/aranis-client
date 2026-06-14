'use client';

import { useUser } from '@/context/UserContext';
import { logOut } from '@/services/auth/logout';
import { IUser } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { userSidebarMenu } from './user-menu';

const UserSidebar = ({ user, logoUrl }: { user: IUser; logoUrl?: string }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    setUser(null);
    window.location.href = '/login';
  };

  const isLinkActive = (url: string) => {
    if (url === '/dashboard') return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <div className="dark:bg- flex w-full flex-col overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-white/10">
      {/* Profile Info */}
      <div className="flex items-center gap-4 p-6">
        <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-200 dark:border-white/10">
          <Image
            src={(user as any)?.image || '/images/default-avatar.png'}
            alt={user?.firstName || 'User'}
            fill
            className="object-cover"
          />
        </div>
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
      <div className="flex flex-col px-4 pb-4">
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
      <div className="mt-auto p-4">
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
