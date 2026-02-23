import { MenuGroup } from '@/types/admin-menu';
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';

const userSidebarMenu: MenuGroup[] = [
  {
    title: 'Portal',
    menu: [{ name: 'Dashboard', url: '/user', icon: LayoutDashboard }],
  },
  {
    title: 'Shopping',
    menu: [
      { name: 'My Orders', url: '/user/orders', icon: ShoppingBag },
      { name: 'Products', url: '/products', icon: Package },
    ],
  },
  {
    title: 'Account',
    menu: [
      { name: 'Profile', url: '/user/settings/profile', icon: User },
      { name: 'Settings', url: '/user/settings', icon: Settings },
    ],
  },
];

export { userSidebarMenu };
