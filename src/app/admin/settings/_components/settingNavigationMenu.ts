import { Role } from '@/types';
import { Lock, LucideIcon, Palette, User } from 'lucide-react';

export interface SettingMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  roles?: Role[];
}

const settingNavigationMenu: SettingMenuItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    href: '/admin/settings/profile',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    id: 'password',
    label: 'Password',
    href: '/admin/settings/password',
    icon: Lock,
    description: 'Update your password',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    href: '/admin/settings/appearance',
    icon: Palette,
    description: 'Customize theme and appearance',
  },
];

export { settingNavigationMenu };
