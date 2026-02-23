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
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { IUser } from '@/types';
import { Settings, User } from 'lucide-react';
import Link from 'next/link';

const UserFooter = ({ user }: { user: IUser }) => {
    const { isMobile } = useSidebar();

    const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
    const initials = fullName
        ? fullName
            .split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'U';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg bg-slate-800">
                                <AvatarImage
                                    src={user?.picture ? user?.picture : '/profile.jpg'}
                                    alt={user?.fullName}
                                />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.fullName}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex flex-col items-center justify-center gap-2 px-1 py-3 text-center text-sm">
                                <Avatar className="h-16 w-16 rounded-full bg-slate-800">
                                    <AvatarImage
                                        src={user?.picture ? user?.picture : '/profile.jpg'}
                                        alt={user?.fullName}
                                    />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="truncate font-semibold">{user?.fullName}</p>
                                    <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/user/settings/profile"
                                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/user/settings"
                                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5"
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <LogOutDropDown />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export default UserFooter;
