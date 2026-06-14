import { MenuGroup } from '@/types/admin-menu';
import {
  Bell,
  BookOpen,
  Heart,
  LayoutDashboard,
  Package,
  Star,
  Tag,
  User,
} from 'lucide-react';

const userSidebarMenu: MenuGroup[] = [
  {
    title: 'Portal',
    menu: [
      { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { name: 'My Profile', url: '/my-profile', icon: User },
      { name: 'My Orders', url: '/dashboard/orders', icon: Package },
      { name: 'Wishlist', url: '/wishlist', icon: Heart },
      { name: 'Coupon', url: '#', icon: Tag },
      { name: 'Review', url: '#', icon: Star },
      { name: 'Address Book', url: '#', icon: BookOpen },
      { name: 'Notification', url: '/notifications', icon: Bell },
    ],
  },
];

export { userSidebarMenu };
