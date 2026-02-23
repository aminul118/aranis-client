import { MenuGroup } from '@/types/admin-menu';
import {
  Globe,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';

const userSidebarMenu: MenuGroup[] = [
  {
    title: 'Portal',
    menu: [
      { name: 'Dashboard', url: '/user', icon: LayoutDashboard },
      { name: 'Website', url: '/', icon: Globe },
    ],
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
      { name: 'Profile', url: '/settings/profile', icon: User },
      { name: 'Settings', url: '/settings/appearance', icon: Settings },
    ],
  },
];

export { userSidebarMenu };
