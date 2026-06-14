'use client';

import LogOutDropDown from '@/components/common/log-out-dropdown';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDefaultDashboardRoute } from '@/services/user/user-access';
import { IUser } from '@/types';
import { LayoutGrid, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NavUser = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const initials = fullName
    ? fullName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleDashboardRedirect = () => {
    const route = getDefaultDashboardRoute(user.role as any);
    router.push(route);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.picture || ''} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="center" sideOffset={8}>
        <DropdownMenuGroup className="mt-3 flex flex-col items-center gap-2">
          <Avatar className="h-14 w-14 object-cover">
            <AvatarImage src={user?.picture || ''} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <div className="flex flex-col items-center justify-center space-y-1 pb-2">
            <p className="text-sm leading-none font-medium">{fullName}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
            <>
              <DropdownMenuItem
                onClick={handleDashboardRedirect}
                className="flex cursor-pointer items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  href="/settings/profile"
                  className="flex items-center gap-2"
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    👤
                  </span>
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={handleDashboardRedirect}
                className="flex cursor-pointer items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              {user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/track-order"
                      className="flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      <span>Track Order</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
          <DropdownMenuSeparator />

          <LogOutDropDown />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUser;
