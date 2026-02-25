import { MenuGroup, UserRole } from '@/types/admin-menu';
import {
  Globe,
  ImageIcon,
  Layers,
  LayoutDashboard,
  Menu as MenuIcon,
  MessageCircle,
  Package,
  Palette,
  ShoppingCart,
  TicketPercent,
  Users,
} from 'lucide-react';

const adminSidebarMenu: MenuGroup[] = [
  {
    title: 'Dashboard',
    menu: [
      { name: 'Overview', url: '/admin', icon: LayoutDashboard },
      { name: 'Website', url: '/', icon: Globe },
    ],
  },
  {
    title: 'E-commerce',
    menu: [
      { name: 'Products', url: '/admin/products', icon: Package },

      { name: 'Coupons', url: '/admin/coupons', icon: TicketPercent },
      { name: 'Orders', url: '/admin/orders', icon: ShoppingCart },
    ],
  },
  {
    title: 'Content',
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
    // Only SUPER_ADMIN sees user management by default
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Support Center', url: '/admin/chat', icon: MessageCircle },
      { name: 'Users', url: '/admin/users', icon: Users },
    ],
  },
];

export { adminSidebarMenu };
