'use client';

import LogOutDropDown from '@/components/modules/Authentication/log-out-dropdown';
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
import {
  LayoutDashboard,
  Lock,
  MessageCircle,
  Palette,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  user: IUser;
  portalType?: 'admin' | 'user';
}

const HeaderUser = ({ user }: Props) => {
  const pathname = usePathname();
  const isInsidePortal =
    pathname.startsWith('/admin') || pathname.startsWith('/user');

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
        {/* ✅ Always dark avatar styling */}
        <Avatar className="h-9 w-9 cursor-pointer border-2 border-white/15 transition-all hover:border-white/30">
          <AvatarImage
            src={user?.picture ? user?.picture : '/profile.jpg'}
            alt={user?.fullName}
          />
          <AvatarFallback className="bg-white/10 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* ✅ Always dark dropdown (ignores theme) */}
      <DropdownMenuContent
        className="w-64 rounded-xl border border-white/10 bg-[#0b0b0b] p-2 text-white shadow-xl"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage
                src={user?.picture ? user?.picture : '/profile.jpg'}
                alt={user?.fullName}
              />
              <AvatarFallback className="bg-white/10 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col space-y-0.5">
              <span className="truncate text-sm leading-none font-bold text-white">
                {user?.fullName}
              </span>
              <span className="truncate text-[11px] leading-none text-white/60">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2 bg-white/10" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem asChild>
            <Link
              href="/settings/profile"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10"
            >
              <User className="h-4 w-4 text-white/60" />
              <span className="text-sm">My Profile</span>
            </Link>
          </DropdownMenuItem>

          {!isInsidePortal && (
            <DropdownMenuItem asChild>
              <Link
                href={dashboardRoute}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4 text-white/60" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link
              href="/settings/password"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10"
            >
              <Lock className="h-4 w-4 text-white/60" />
              <span className="text-sm">Password</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings/appearance"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10"
            >
              <Palette className="h-4 w-4 text-white/60" />
              <span className="text-sm">Appearance</span>
            </Link>
          </DropdownMenuItem>

          {/* ✅ Keep link visible on dark always */}
          <DropdownMenuItem asChild>
            <Link
              href="/user/chat"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-medium text-blue-400 transition-colors hover:bg-white/10 hover:text-blue-300 focus:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Live Support Chat</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-white/10" />

        <div className="px-1">
          {/* If LogOutDropDown has theme colors inside, paste it and I’ll dark-force it too */}
          <LogOutDropDown />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUser;
