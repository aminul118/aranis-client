import { type LucideIcon } from 'lucide-react';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type SubMenu = {
  name: string;
  url: string;
  roles?: UserRole[];
};

export type MenuItem = {
  name: string;
  url: string;
  icon: LucideIcon;
  roles?: UserRole[];
  subMenu?: SubMenu[];
};

export type MenuGroup = {
  title?: string;
  roles?: UserRole[];
  menu: MenuItem[];
};
