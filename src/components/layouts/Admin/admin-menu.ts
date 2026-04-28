import { MenuGroup, UserRole } from '@/types/admin-menu';
import {
  BellRing,
  Globe,
  ImageIcon,
  Layers,
  LayoutDashboard,
  Lock,
  Menu as MenuIcon,
  MessageCircle,
  Package,
  Palette,
  ShoppingCart,
  TicketPercent,
  User,
  Users,
} from 'lucide-react';

const adminSidebarMenu: MenuGroup[] = [
  {
    title: 'Dashboard',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Overview', url: '/admin', icon: LayoutDashboard },
      { name: 'Website', url: '/', icon: Globe },
    ],
  },
  {
    title: 'E-commerce',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Products', url: '/admin/products', icon: Package },
      { name: 'Coupons', url: '/admin/coupons', icon: TicketPercent },
      { name: 'Orders', url: '/admin/orders', icon: ShoppingCart },
      {
        name: 'Restock Requests',
        url: '/admin/restock-requests',
        icon: BellRing,
      },
    ],
  },
  {
    title: 'Content',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Site Settings', url: '/admin/site', icon: Globe },
      { name: 'Navbar', url: '/admin/navbar', icon: MenuIcon },
      { name: 'Categories', url: '/admin/categories', icon: Layers },
      { name: 'Colors', url: '/admin/colors', icon: Palette },
      { name: 'Hero Banners', url: '/admin/hero-banners', icon: ImageIcon },
      { name: 'Mini Banners', url: '/admin/mini-banners', icon: ImageIcon },
    ],
  },
  {
    title: 'System',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Support Center', url: '/admin/chat', icon: MessageCircle },
      { name: 'User Management', url: '/admin/users', icon: Users },
    ],
  },
  {
    title: 'Account',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'My Profile', url: '/admin/settings/profile', icon: User },
      { name: 'Password', url: '/admin/settings/password', icon: Lock },
      { name: 'Appearance', url: '/admin/settings/appearance', icon: Palette },
    ],
  },
];

export { adminSidebarMenu };
