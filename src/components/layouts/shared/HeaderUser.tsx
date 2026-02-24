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
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  user: IUser;
  portalType?: 'admin' | 'user';
}

const HeaderUser = ({ user, portalType }: Props) => {
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
        <Avatar className="border-primary/10 hover:border-primary/30 h-9 w-9 cursor-pointer border-2 transition-all">
          <AvatarImage
            src={user?.picture ? user?.picture : '/profile.jpg'}
            alt={user?.fullName}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-xl p-2"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="border-border h-10 w-10 border">
              <AvatarImage
                src={user?.picture ? user?.picture : '/profile.jpg'}
                alt={user?.fullName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <span className="truncate text-sm leading-none font-bold">
                {user?.fullName}
              </span>
              <span className="text-muted-foreground truncate text-[11px] leading-none">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem asChild>
            <Link
              href="/settings/profile"
              className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2"
            >
              <User className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">My Profile</span>
            </Link>
          </DropdownMenuItem>

          {!isInsidePortal && (
            <DropdownMenuItem asChild>
              <Link
                href={dashboardRoute}
                className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2"
              >
                <LayoutDashboard className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link
              href="/settings/password"
              className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2"
            >
              <Lock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Password</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings/appearance"
              className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2"
            >
              <Settings className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Appearance</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/user/chat"
              className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-medium text-blue-600 dark:text-blue-400"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Live Support Chat</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />
        <div className="px-1">
          <LogOutDropDown />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUser;
