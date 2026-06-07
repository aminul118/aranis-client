'use client';

import DynamicMenu from '@/components/layouts/shared/DynamicMenu';
import { UserRole } from '@/types/admin-menu';
import { userSidebarMenu } from './user-menu';

interface MenuProps {
  role?: UserRole | string;
}

const Menu = ({ role }: MenuProps) => {
  return <DynamicMenu menuGroups={userSidebarMenu} role={role} />;
};

export default Menu;
