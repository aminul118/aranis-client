'use client';

import LogOutDropDown from '@/components/common/log-out-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDefaultDashboardRoute } from '@/services/user/user-access';
import { IUser } from '@/types';
import { LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  user: IUser;
  portalType?: 'admin' | 'user';
}

const HeaderUser = ({ user }: Props) => {
  const pathname = usePathname();
  const isInsidePortal =
    pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const initials = fullName
    ? fullName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const dashboardRoute = getDefaultDashboardRoute(user?.role as any);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border-2 border-gray-200 transition-all hover:border-gray-300 dark:border-white/15 dark:hover:border-white/30">
          <AvatarImage
            src={user?.picture ? user?.picture : '/profile.jpg'}
            alt={user?.fullName}
          />
          <AvatarFallback className="bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-xl dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-200 dark:border-white/10">
              <AvatarImage
                src={user?.picture ? user?.picture : '/profile.jpg'}
                alt={user?.fullName}
              />
              <AvatarFallback className="bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col space-y-0.5">
              <span className="truncate text-sm leading-none font-bold text-gray-900 dark:text-white">
                {user?.fullName}
              </span>
              <span className="truncate text-[11px] leading-none text-gray-500 dark:text-white/60">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-white/10" />

        <DropdownMenuGroup className="space-y-1">
          {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={dashboardRoute}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-500 dark:text-white/60" />
                  <span className="text-sm">Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings/profile"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10"
                >
                  <User className="h-4 w-4 text-gray-500 dark:text-white/60" />
                  <span className="text-sm">Profile</span>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={dashboardRoute}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-500 dark:text-white/60" />
                  <span className="text-sm">Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/profile"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10"
                >
                  <User className="h-4 w-4 text-gray-500 dark:text-white/60" />
                  <span className="text-sm">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/track-order"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10"
                >
                  <span className="flex h-4 w-4 items-center justify-center text-gray-500 dark:text-white/60">
                    🚚
                  </span>
                  <span className="text-sm">Track Order</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-white/10" />

        <div className="px-1">
          {/* If LogOutDropDown has theme colors inside, paste it and I’ll dark-force it too */}
          <LogOutDropDown />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUser;
