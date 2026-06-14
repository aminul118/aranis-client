import { MenuGroup } from '@/types/admin-menu';
import {
  BookOpen,
  LayoutDashboard,
  Lock,
  MessageCirclePlus,
  Package,
  Palette,
  Ticket,
  User,
} from 'lucide-react';

const userSidebarMenu: MenuGroup[] = [
  {
    title: 'Portal',
    menu: [
      { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { name: 'My Orders', url: '/dashboard/orders', icon: Package },
      {
        name: 'Customer Support',
        url: '/dashboard/chat',
        icon: MessageCirclePlus,
      },
      { name: 'My Coupons', url: '/dashboard/coupons', icon: Ticket },
      { name: 'My Profile', url: '/dashboard/profile', icon: User },
      { name: 'Address Book', url: '/dashboard/address', icon: BookOpen },
      { name: 'Security', url: '/dashboard/security', icon: Lock },
      { name: 'Appearance', url: '/dashboard/appearance', icon: Palette },
    ],
  },
];

export { userSidebarMenu };
