import { MenuGroup, UserRole } from '@/types/admin-menu';
import {
  Globe,
  Layers,
  LayoutDashboard,
  Menu as MenuIcon,
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
      { name: 'Categories', url: '/admin/categories', icon: Layers },
      { name: 'Colors', url: '/admin/colors', icon: Palette },
      { name: 'Navbar', url: '/admin/navbar', icon: MenuIcon },
      { name: 'Coupons', url: '/admin/coupons', icon: TicketPercent },
      { name: 'Orders', url: '/admin/orders', icon: ShoppingCart },
    ],
  },
  {
    title: 'System',
    // Only SUPER_ADMIN sees user management by default
    roles: ['SUPER_ADMIN'] as UserRole[],
    menu: [{ name: 'Users', url: '/admin/users', icon: Users }],
  },
];

export { adminSidebarMenu };
