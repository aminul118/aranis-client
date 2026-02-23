import { MenuGroup } from '@/types/admin-menu';
import { Globe, LayoutDashboard, Package, ShoppingBag } from 'lucide-react';

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
      { name: 'Shop', url: '/shop', icon: Package },
    ],
  },
];

export { userSidebarMenu };
