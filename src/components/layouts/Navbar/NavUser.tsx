'use client';

import LogOutDropDown from '@/components/modules/Authentication/log-out-dropdown';
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
import { LayoutGrid } from 'lucide-react';
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
          <AvatarImage
            src={user?.picture || './user-placeholder.png'}
            alt={fullName}
          />
          <AvatarFallback>{initials}</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="center" sideOffset={8}>
        <DropdownMenuGroup className="mt-3 flex flex-col items-center gap-2">
          <Avatar className="h-14 w-14 object-cover">
            <AvatarImage
              src={user?.picture || './user-placeholder.png'}
              alt={fullName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <DropdownMenuItem>
            <Link href={'/my-profile'}>View Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleDashboardRedirect}
            className="text-center"
          >
            <LayoutGrid /> Dashboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <LogOutDropDown />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUser;
