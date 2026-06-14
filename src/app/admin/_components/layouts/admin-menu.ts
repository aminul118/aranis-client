import { MenuGroup, UserRole } from '@/types/admin-menu';
import {
  BellRing,
  Gift,
  Globe,
  HeartPulse,
  ImageIcon,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  Megaphone,
  Menu as MenuIcon,
  MessageCircle,
  Package,
  Palette,
  Ruler,
  ShoppingCart,
  TicketPercent,
  Truck,
  User,
  Users,
} from 'lucide-react';

const adminSidebarMenu: MenuGroup[] = [
  {
    title: 'Dashboard',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [{ name: 'Overview', url: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'System',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Support Center', url: '/admin/chat', icon: MessageCircle },
      { name: 'Users', url: '/admin/users', icon: Users },
    ],
  },
  {
    title: 'E-commerce',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Products', url: '/admin/products', icon: Package },
      { name: 'Gift Cards', url: '/admin/gift-cards', icon: Gift },
      { name: 'Offers', url: '/admin/offers', icon: TicketPercent },
      { name: 'Coupons', url: '/admin/coupons', icon: TicketPercent },
      {
        name: 'Customer Interest',
        url: '/admin/customer-interest',
        icon: HeartPulse,
      },
      { name: 'Orders', url: '/admin/orders', icon: ShoppingCart },
      {
        name: 'Restock Requests',
        url: '/admin/restock-requests',
        icon: BellRing,
      },
      { name: 'Delivery Charge', url: '/admin/delivery-charge', icon: Truck },
    ],
  },
  {
    title: 'Content',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'Site Settings', url: '/admin/site', icon: Globe },
      { name: 'Outlet Locations', url: '/admin/locations', icon: MapPin },
      { name: 'Navbar', url: '/admin/navbar', icon: MenuIcon },
      { name: 'Categories', url: '/admin/categories', icon: Layers },
      { name: 'Colors', url: '/admin/colors', icon: Palette },
      { name: 'Sizes', url: '/admin/sizes', icon: Ruler },
      { name: 'Size Guides', url: '/admin/size-guides', icon: Ruler },
      { name: 'Hero Banners', url: '/admin/hero-banners', icon: ImageIcon },
      { name: 'Mini Banners', url: '/admin/mini-banners', icon: ImageIcon },
      { name: 'Popup Banner', url: '/admin/popup-banners', icon: Megaphone },
    ],
  },
  {
    title: 'Account Settings',
    roles: ['SUPER_ADMIN', 'ADMIN'] as UserRole[],
    menu: [
      { name: 'My Profile', url: '/settings/profile', icon: User },
      { name: 'Security', url: '/settings/password', icon: Lock },
      { name: 'Appearance', url: '/settings/appearance', icon: Palette },
    ],
  },
];

export { adminSidebarMenu };
