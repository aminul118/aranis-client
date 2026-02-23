'use client';

import { adminSidebarMenu } from '@/components/layouts/Admin/admin-menu';
import DynamicMenu from '@/components/layouts/shared/DynamicMenu';
import { UserRole } from '@/types/admin-menu';

interface MenuProps {
  role?: UserRole | string;
}

const Menu = ({ role }: MenuProps) => {
  return <DynamicMenu menuGroups={adminSidebarMenu} role={role} />;
};

export default Menu;
