'use client';

import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { Gift, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    {
      label: 'OFFER',
      href: '/shop?featured=true',
      icon: Gift,
      color: 'text-orange-400',
    },

    {
      label: 'PROFILE',
      href: '/profile',
      icon: User,
    },

    {
      label: 'LOCATION',
      href: '/location',
      icon: MapPin,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-100 bg-white lg:hidden dark:border-white/5 dark:bg-[#0a0a0a]">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex min-w-[64px] flex-col items-center justify-center gap-1',
                isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={cn(
                    'transition-transform duration-200',
                    isActive && 'scale-110',
                    item.color,
                  )}
                />
              </div>
              <span className="text-[9px] font-black tracking-tighter uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe Area Padding for mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default MobileBottomNav;
