import { MenuGroup } from '@/types/admin-menu';
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Lock,
  MessageCirclePlus,
  Package,
  Palette,
  RefreshCcw,
  Ticket,
  User,
} from 'lucide-react';

const userSidebarMenu: MenuGroup[] = [
  {
    title: 'Portal',
    menu: [
      { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { name: 'My Orders', url: '/dashboard/orders', icon: Package },
      { name: 'My Invoices', url: '/dashboard/invoices', icon: FileText },
      {
        name: 'Customer Support',
        url: '/dashboard/chat',
        icon: MessageCirclePlus,
      },
      { name: 'My Coupons', url: '/dashboard/coupons', icon: Ticket },
      {
        name: 'Restock Requests',
        url: '/dashboard/restock-requests',
        icon: RefreshCcw,
      },
      { name: 'My Profile', url: '/dashboard/profile', icon: User },
      { name: 'Address Book', url: '/dashboard/address', icon: BookOpen },
      { name: 'Security', url: '/dashboard/security', icon: Lock },
      { name: 'Appearance', url: '/dashboard/appearance', icon: Palette },
    ],
  },
];

export { userSidebarMenu };
