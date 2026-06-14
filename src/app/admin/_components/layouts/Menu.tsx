'use client';

import DynamicMenu from '@/components/layouts/DynamicMenu';
import { adminSidebarMenu } from './admin-menu';

import { IUser } from '@/types';

interface MenuProps {
  user?: IUser;
}

const Menu = ({ user }: MenuProps) => {
  return (
    <DynamicMenu menuGroups={adminSidebarMenu} role={user?.role} user={user} />
  );
};

export default Menu;
