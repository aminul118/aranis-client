'use client';

import { userSidebarMenu } from '@/components/layouts/User/user-menu';
import DynamicMenu from '@/components/layouts/shared/DynamicMenu';
import { UserRole } from '@/types/admin-menu';

interface MenuProps {
    role?: UserRole | string;
}

const Menu = ({ role }: MenuProps) => {
    return <DynamicMenu menuGroups={userSidebarMenu} role={role} />;
};

export default Menu;
