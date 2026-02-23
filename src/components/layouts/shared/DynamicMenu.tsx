'use client';

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
import { MenuGroup, UserRole } from '@/types/admin-menu';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DynamicMenuProps {
    menuGroups: MenuGroup[];
    role?: UserRole | string;
}

const DynamicMenu = ({ menuGroups, role }: DynamicMenuProps) => {
    const pathname = usePathname();

    const isLinkActive = (url: string) => {
        if (url === '/admin' || url === '/user') return pathname === url;
        return pathname === url || pathname.startsWith(`${url}/`);
    };

    // Filter groups by role — if a group has no `roles`, it's visible to everyone
    const visibleGroups = menuGroups.filter((group) => {
        if (!group.roles || group.roles.length === 0) return true;
        return role ? group.roles.includes(role as UserRole) : false;
    });

    return (
        <>
            {visibleGroups.map((group, gi) => {
                // Filter items within the group too
                const visibleItems = group.menu.filter((item) => {
                    if (!item.roles || item.roles.length === 0) return true;
                    return role ? item.roles.includes(role as UserRole) : false;
                });

                if (visibleItems.length === 0) return null;

                return (
                    <SidebarGroup key={gi}>
                        {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}

                        <SidebarMenu>
                            {visibleItems.map((menu, i) => {
                                const hasSubMenu = menu.subMenu && menu.subMenu.length > 0;
                                const active = isLinkActive(menu.url);

                                if (!hasSubMenu) {
                                    return (
                                        <SidebarMenuItem key={i}>
                                            <SidebarMenuButton asChild isActive={active}>
                                                <Link href={menu.url}>
                                                    {menu.icon && <menu.icon />}
                                                    <span>{menu.name}</span>
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
                                                    <div>
                                                        {menu.icon && <menu.icon />}
                                                        <span>{menu.name}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </div>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {menu.subMenu
                                                        ?.filter((sub) => {
                                                            if (!sub.roles || sub.roles.length === 0) return true;
                                                            return role ? sub.roles.includes(role as UserRole) : false;
                                                        })
                                                        .map((subItem, j) => {
                                                            const subActive = isLinkActive(subItem.url);
                                                            return (
                                                                <SidebarMenuSubItem key={j} className="text-sm">
                                                                    <SidebarMenuSubButton asChild isActive={subActive}>
                                                                        <Link href={subItem.url} className="block rounded px-2 py-1">
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
